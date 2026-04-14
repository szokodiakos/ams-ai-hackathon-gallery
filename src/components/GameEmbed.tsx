export default function GameEmbed({ gameId }: { gameId: string }) {
  return (
    <iframe
      src={`/games/${gameId}/index.html`}
      title="Game"
      className="w-full rounded-lg border border-gray-200"
      style={{ minHeight: "600px" }}
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
