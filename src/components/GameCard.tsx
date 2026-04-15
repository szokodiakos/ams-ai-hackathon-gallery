"use client";

import { useRouter } from "next/navigation";
import type { Game } from "@/data/games";

export default function GameCard({ game }: { game: Game }) {
  const router = useRouter();

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/games/${game.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/games/${game.id}`);
        }
      }}
      className="card-glow group block cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-300 hover:scale-[1.02]"
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: "var(--color-card-border)",
      }}
    >
      <div
        className="relative aspect-video w-full"
        style={{ backgroundColor: "var(--color-bg-darker)" }}
      >
        {game.comingSoon ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p
                className="font-pixel text-2xl"
                style={{ color: "var(--color-accent1)", opacity: 0.3 }}
              >
                ?
              </p>
            </div>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={game.thumbnail}
            alt={`${game.title} thumbnail`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {game.comingSoon && (
          <span
            className="absolute right-2 top-2 animate-blink rounded border px-2 py-0.5 font-pixel text-[8px]"
            style={{
              borderColor: "var(--color-accent2)",
              color: "var(--color-accent2)",
              backgroundColor: "var(--color-bg)",
            }}
          >
            COMING SOON
          </span>
        )}
      </div>
      <div className="p-4">
        <h2
          className="font-pixel text-xs leading-relaxed"
          style={{ color: "var(--color-accent1)" }}
        >
          {game.title}
        </h2>
        <p
          className="mt-1 font-mono text-[10px]"
          style={{ color: "var(--color-accent2)" }}
        >
          by {game.teamName}
        </p>
        <p
          className="mt-2 font-mono text-xs"
          style={{ color: "var(--color-text-dim)" }}
        >
          {game.description}
        </p>
        {game.repoUrl && (
          <a
            href={game.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] transition-opacity hover:opacity-80"
            style={{ color: "var(--color-accent2)" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            SOURCE
          </a>
        )}
      </div>
    </div>
  );
}
