export default function GameEmbed({ gameId }: { gameId: string }) {
  return (
    <iframe
      src={`/games/${gameId}/index.html`}
      title="Game"
      data-testid="game-iframe"
      className="w-full rounded-lg border-2"
      style={{
        minHeight: "600px",
        borderColor: "var(--color-card-border)",
        backgroundColor: "var(--color-bg-darker)",
      }}
      sandbox="allow-scripts allow-same-origin allow-popups"
      allow="autoplay; gamepad; keyboard-map"
    />
  );
}
