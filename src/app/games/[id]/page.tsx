import { notFound } from "next/navigation";
import Link from "next/link";
import GameEmbed from "@/components/GameEmbed";
import { getGameById, games } from "@/data/games";

export function generateStaticParams() {
  return games.map((game) => ({ id: game.id }));
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = getGameById(id);

  if (!game) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        &larr; Back to Gallery
      </Link>
      <h1 className="mb-6 text-3xl font-bold">{game.title}</h1>
      <p className="mb-6 text-gray-600">{game.description}</p>
      {game.comingSoon ? (
        <div className="flex min-h-[600px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-4xl">🎮</p>
            <p className="mt-4 text-lg font-medium text-gray-500">
              This game is coming soon!
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Check back later to play.
            </p>
          </div>
        </div>
      ) : (
        <GameEmbed gameId={game.id} />
      )}
    </div>
  );
}
