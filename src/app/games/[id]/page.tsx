import { notFound } from "next/navigation";
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

  if (game.comingSoon) {
    return (
      <div
        className="flex h-screen w-screen items-center justify-center"
        style={{ backgroundColor: "var(--color-bg-darker)" }}
      >
        <div className="text-center">
          <p
            className="animate-blink font-pixel text-4xl"
            style={{ color: "var(--color-accent1)", opacity: 0.4 }}
          >
            ?
          </p>
          <p
            className="mt-6 font-pixel text-xs"
            style={{ color: "var(--color-accent2)" }}
          >
            COMING SOON
          </p>
          <p
            className="mt-2 font-mono text-sm"
            style={{ color: "var(--color-text-dim)" }}
          >
            Check back later to play.
          </p>
        </div>
      </div>
    );
  }

  return <GameEmbed gameId={game.id} />;
}
