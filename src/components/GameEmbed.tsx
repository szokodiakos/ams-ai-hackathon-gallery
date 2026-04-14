export default function GameEmbed({ gameId }: { gameId: string }) {
  return (
    <iframe
      src={`/games/${gameId}/index.html`}
      title="Game"
      data-testid="game-iframe"
      className="fixed inset-0 h-screen w-screen border-0"
      style={{ zIndex: 50 }}
      sandbox="allow-scripts allow-same-origin allow-popups"
      allow="autoplay; gamepad; keyboard-map"
    />
  );
}
