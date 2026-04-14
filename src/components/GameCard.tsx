import Link from "next/link";
import type { Game } from "@/data/games";

export default function GameCard({ game }: { game: Game }) {
  return (
    <Link
      href={`/games/${game.id}`}
      className="card-glow group block overflow-hidden rounded-lg border-2 transition-all duration-300 hover:scale-[1.02]"
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
          className="mt-2 font-mono text-xs"
          style={{ color: "var(--color-text-dim)" }}
        >
          {game.description}
        </p>
      </div>
    </Link>
  );
}
