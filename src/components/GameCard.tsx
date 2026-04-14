import Link from "next/link";
import type { Game } from "@/data/games";

export default function GameCard({ game }: { game: Game }) {
  return (
    <Link
      href={`/games/${game.id}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-video w-full bg-gray-100">
        {game.comingSoon ? (
          <div className="flex h-full items-center justify-center bg-gray-50">
            <span className="text-4xl text-gray-300">🎮</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={game.thumbnail}
            alt={`${game.title} thumbnail`}
            className="h-full w-full object-cover"
          />
        )}
        {game.comingSoon && (
          <span className="absolute right-2 top-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
            Coming Soon
          </span>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
          {game.title}
        </h2>
        <p className="mt-1 text-sm text-gray-600">{game.description}</p>
      </div>
    </Link>
  );
}
