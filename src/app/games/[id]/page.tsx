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
        className="mb-6 inline-flex items-center font-mono text-sm transition-colors"
        style={{ color: "var(--color-accent1)" }}
      >
        &larr; BACK TO GALLERY
      </Link>
      <h1
        className="text-glow-1 mb-4 font-pixel text-lg"
        style={{ color: "var(--color-accent1)" }}
      >
        {game.title}
      </h1>
      <p className="mb-6 font-mono text-sm" style={{ color: "var(--color-text-dim)" }}>
        {game.description}
      </p>
      {game.comingSoon ? (
        <div
          className="flex min-h-[600px] items-center justify-center rounded-lg border-2"
          style={{
            borderColor: "var(--color-card-border)",
            backgroundColor: "var(--color-bg-darker)",
          }}
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
      ) : (
        <GameEmbed gameId={game.id} />
      )}
    </div>
  );
}
