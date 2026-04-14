#!/usr/bin/env bash
set -euo pipefail

# ─── Configuration ───────────────────────────────────────────────────────────
POLL_INTERVAL=30  # seconds between polls
MAX_TURNS=50      # max Claude conversation turns per event

# ─── Derived paths ───────────────────────────────────────────────────────────
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STATE_DIR="$REPO_ROOT/.claude"
STATE_FILE="$STATE_DIR/watch-state.json"
LOG_DIR="$STATE_DIR/watch-logs"

# ─── Resolve repo owner/name from git remote ────────────────────────────────
REPO="$(git -C "$REPO_ROOT" remote get-url origin | sed -E 's#.*[:/]([^/]+/[^/.]+)(\.git)?$#\1#')"

# ─── Helpers ─────────────────────────────────────────────────────────────────
log() { echo "[$(date '+%H:%M:%S')] $*"; }

ensure_state() {
  mkdir -p "$LOG_DIR"
  if [[ ! -f "$STATE_FILE" ]]; then
    # Seed with current time so we don't process old events
    echo "{\"last_check\":\"$(date -u '+%Y-%m-%dT%H:%M:%SZ')\",\"processed\":[]}" > "$STATE_FILE"
    log "Initialized state file (events before now will be skipped)"
  fi
}

get_last_check() {
  jq -r '.last_check' "$STATE_FILE"
}

is_processed() {
  local event_id="$1"
  jq -e --arg id "$event_id" '.processed | index($id) != null' "$STATE_FILE" > /dev/null 2>&1
}

mark_processed() {
  local event_id="$1"
  local tmp
  tmp=$(mktemp)
  # Keep only last 500 processed IDs to prevent unbounded growth
  jq --arg id "$event_id" \
    '.processed = ((.processed + [$id]) | .[-500:]) | .last_check = (now | strftime("%Y-%m-%dT%H:%M:%SZ"))' \
    "$STATE_FILE" > "$tmp" && mv "$tmp" "$STATE_FILE"
}

update_last_check() {
  local tmp
  tmp=$(mktemp)
  jq '.last_check = (now | strftime("%Y-%m-%dT%H:%M:%SZ"))' "$STATE_FILE" > "$tmp" && mv "$tmp" "$STATE_FILE"
}

run_claude() {
  local prompt="$1"
  local log_file="$2"

  log "  Spawning claude..."
  (
    cd "$REPO_ROOT"
    claude -p "$prompt" \
      --allowedTools "Bash,Read,Edit,Write,Glob,Grep" \
      --max-turns "$MAX_TURNS" \
      2>&1
  ) | tee "$log_file"
  log "  Claude finished (log: $log_file)"
}

prepare_branch() {
  # Ensure we're on main with latest code before processing an event
  cd "$REPO_ROOT"
  git checkout main --quiet 2>/dev/null || true
  git pull --quiet 2>/dev/null || true
}

# ─── Event handlers ──────────────────────────────────────────────────────────

handle_new_issue() {
  local number="$1" title="$2" body="$3" author="$4"
  local log_file="$LOG_DIR/issue-${number}-$(date '+%Y%m%d-%H%M%S').log"

  log "New issue #${number}: ${title}"
  prepare_branch

  run_claude "$(cat <<EOF
A new issue has been opened in this repository ($REPO).

ISSUE NUMBER: #${number}
TITLE: ${title}
BODY:
${body}

AUTHOR: ${author}

Follow the workflow described in CLAUDE.md:
1. Read the issue carefully
2. If requirements are unclear, post clarifying questions as a comment using: gh issue comment ${number} --repo ${REPO} --body "your questions here"
3. If requirements ARE clear enough, create a spec with /opsx:propose, implement with /opsx:apply, and open a PR
4. Always link the PR to this issue with "Closes #${number}"
5. Remember to include <!-- claude-watcher --> at the end of every comment you post
EOF
)" "$log_file"
}

handle_issue_comment() {
  local issue_number="$1" comment_body="$2" comment_author="$3"
  local log_file="$LOG_DIR/comment-issue-${issue_number}-$(date '+%Y%m%d-%H%M%S').log"

  # Fetch full issue context
  local issue_json
  issue_json=$(gh issue view "$issue_number" --repo "$REPO" --json title,body,comments 2>/dev/null || echo "{}")
  local issue_title issue_body
  issue_title=$(echo "$issue_json" | jq -r '.title // "unknown"')
  issue_body=$(echo "$issue_json" | jq -r '.body // ""')

  log "Comment on issue #${issue_number} by ${comment_author}"
  prepare_branch

  run_claude "$(cat <<EOF
A comment was posted on issue #${issue_number} in repository ${REPO}.

ISSUE TITLE: ${issue_title}
ISSUE BODY:
${issue_body}

NEW COMMENT by ${comment_author}:
${comment_body}

Follow the workflow described in CLAUDE.md:
- If this answers your clarifying questions: proceed with implementation
- If it adds new requirements: incorporate them into the spec
- If it asks you a question: answer it using: gh issue comment ${issue_number} --repo ${REPO} --body "your response"
- If proceeding with implementation: create branch, spec, implement, and open a PR with "Closes #${issue_number}"
EOF
)" "$log_file"
}

handle_pr_review_comment() {
  local pr_number="$1" comment_body="$2" comment_author="$3" diff_hunk="$4" path="$5"
  local log_file="$LOG_DIR/review-pr-${pr_number}-$(date '+%Y%m%d-%H%M%S').log"

  # Get PR branch
  local pr_branch
  pr_branch=$(gh pr view "$pr_number" --repo "$REPO" --json headRefName --jq '.headRefName' 2>/dev/null || echo "")

  log "PR review comment on #${pr_number} by ${comment_author}"

  if [[ -n "$pr_branch" ]]; then
    cd "$REPO_ROOT"
    git fetch --quiet origin "$pr_branch" 2>/dev/null || true
    git checkout "$pr_branch" --quiet 2>/dev/null || true
    git pull --quiet 2>/dev/null || true
  fi

  run_claude "$(cat <<EOF
A review comment was posted on PR #${pr_number} in repository ${REPO}.

FILE: ${path}
DIFF CONTEXT:
${diff_hunk}

REVIEW COMMENT by ${comment_author}:
${comment_body}

Follow the workflow described in CLAUDE.md:
- Read the feedback carefully
- Make the requested changes on this branch (${pr_branch})
- Commit and push
- Reply to the comment using: gh api repos/${REPO}/pulls/${pr_number}/comments --method POST -f body="your response"
EOF
)" "$log_file"
}

# ─── Main polling loop ───────────────────────────────────────────────────────

main() {
  ensure_state
  log "Watching ${REPO} (poll every ${POLL_INTERVAL}s)"
  log "State: ${STATE_FILE}"
  log "Logs:  ${LOG_DIR}"
  log "Press Ctrl+C to stop"
  echo ""

  trap 'echo ""; log "Stopped."; exit 0' INT TERM

  while true; do
    local since
    since=$(get_last_check)

    # ── 1. Check for new issues ──────────────────────────────────────────
    local issues
    issues=$(gh issue list --repo "$REPO" --state open --json number,title,body,author,createdAt \
      --jq "[.[] | select(.createdAt > \"${since}\")]" 2>/dev/null || echo "[]")

    echo "$issues" | jq -c '.[]' 2>/dev/null | while read -r issue; do
      local number title body author event_id
      number=$(echo "$issue" | jq -r '.number')
      event_id="issue-${number}"

      if is_processed "$event_id"; then
        continue
      fi

      title=$(echo "$issue" | jq -r '.title')
      body=$(echo "$issue" | jq -r '.body // ""')
      author=$(echo "$issue" | jq -r '.author.login')

      handle_new_issue "$number" "$title" "$body" "$author"
      mark_processed "$event_id"
    done

    # ── 2. Check for new issue comments ────────────────────────────────
    local comments
    comments=$(gh api "repos/${REPO}/issues/comments?since=${since}&per_page=50" 2>/dev/null || echo "[]")

    echo "$comments" | jq -c '.[]' 2>/dev/null | while read -r comment; do
      local comment_id comment_body comment_author issue_url issue_number event_id
      comment_id=$(echo "$comment" | jq -r '.id')
      event_id="comment-${comment_id}"

      if is_processed "$event_id"; then
        continue
      fi

      # Skip comments posted by Claude (identified by hidden marker)
      comment_body=$(echo "$comment" | jq -r '.body')
      if echo "$comment_body" | grep -q '<!-- claude-watcher -->'; then
        mark_processed "$event_id"
        continue
      fi

      comment_author=$(echo "$comment" | jq -r '.user.login')
      issue_url=$(echo "$comment" | jq -r '.issue_url')
      issue_number=$(echo "$issue_url" | grep -oE '[0-9]+$')

      # Check if this is a PR comment (has pull_request key) or issue comment
      local is_pr
      is_pr=$(gh api "repos/${REPO}/issues/${issue_number}" --jq '.pull_request // empty' 2>/dev/null || echo "")

      if [[ -n "$is_pr" ]]; then
        # It's a PR — treat as a general PR comment
        handle_pr_review_comment "$issue_number" "$comment_body" "$comment_author" "" ""
      else
        handle_issue_comment "$issue_number" "$comment_body" "$comment_author"
      fi

      mark_processed "$event_id"
    done

    # ── 3. Check for new PR review comments ─────────────────────────────
    local pr_comments
    pr_comments=$(gh api "repos/${REPO}/pulls/comments?since=${since}&per_page=50" 2>/dev/null || echo "[]")

    echo "$pr_comments" | jq -c '.[]' 2>/dev/null | while read -r comment; do
      local comment_id comment_body comment_author diff_hunk path pr_url pr_number event_id
      comment_id=$(echo "$comment" | jq -r '.id')
      event_id="pr-review-${comment_id}"

      if is_processed "$event_id"; then
        continue
      fi

      # Skip comments posted by Claude (identified by hidden marker)
      comment_body=$(echo "$comment" | jq -r '.body')
      if echo "$comment_body" | grep -q '<!-- claude-watcher -->'; then
        mark_processed "$event_id"
        continue
      fi

      comment_author=$(echo "$comment" | jq -r '.user.login')
      diff_hunk=$(echo "$comment" | jq -r '.diff_hunk // ""')
      path=$(echo "$comment" | jq -r '.path // ""')
      pr_url=$(echo "$comment" | jq -r '.pull_request_url')
      pr_number=$(echo "$pr_url" | grep -oE '[0-9]+$')

      handle_pr_review_comment "$pr_number" "$comment_body" "$comment_author" "$diff_hunk" "$path"
      mark_processed "$event_id"
    done

    # ── Update timestamp and sleep ───────────────────────────────────────
    update_last_check
    sleep "$POLL_INTERVAL"
  done
}

main
