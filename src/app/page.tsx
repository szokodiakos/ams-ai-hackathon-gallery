import GameCard from "@/components/GameCard";
import { games } from "@/data/games";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <p
          className="animate-blink font-pixel text-xs tracking-widest"
          style={{ color: "var(--color-accent2)" }}
        >
          8 TEAMS &middot; 8 GAMES &middot; 1 GALLERY
        </p>
        <p
          className="mt-3 font-mono text-sm"
          style={{ color: "var(--color-text-dim)" }}
        >
          INSERT COIN TO PLAY
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
      <div className="mt-12 text-center">
        <p
          className="font-pixel text-[10px] tracking-wider"
          style={{ color: "var(--color-text-dim)" }}
        >
          &copy; 2026 AMS AI HACKATHON
        </p>
      </div>
    </div>
  );
}
