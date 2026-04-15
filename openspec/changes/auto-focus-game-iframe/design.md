## Context

`GameEmbed` is a server component that renders a full-viewport iframe for each game. Since there's no focus management, the browser focuses the page body, and the iframe doesn't receive keyboard events until clicked.

## Goals / Non-Goals

**Goals:**
- Iframe receives focus automatically on mount so keyboard input works immediately
- No visible UI change

**Non-Goals:**
- Focus trapping or focus restoration on blur (games handle their own internal focus)
- Accessibility enhancements beyond auto-focus

## Decisions

**Convert to client component with `useRef` + `useEffect`**
- Rationale: `iframe.focus()` requires DOM access, which means we need a client component with a ref. A `useEffect` ensures the call happens after mount when the DOM element exists.
- Alternative considered: `autoFocus` HTML attribute. Rejected because React doesn't reliably pass `autoFocus` to iframes, and browser behavior with `autoFocus` on iframes is inconsistent.

**Focus on the iframe `load` event**
- Rationale: Calling `.focus()` immediately in `useEffect` may fire before the iframe content has loaded, and some browsers ignore focus on iframes that haven't loaded yet. Listening for the `load` event ensures the iframe is ready to receive focus.
- Fallback: Also call `.focus()` in useEffect as an immediate attempt, so fast-loading local content gets focused without waiting.

## Risks / Trade-offs

- [Browser security policies may block programmatic iframe focus in some scenarios] → Mitigated by the iframe being same-origin (`/games/{id}/index.html` served from the same domain). Same-origin iframes can be focused programmatically.
