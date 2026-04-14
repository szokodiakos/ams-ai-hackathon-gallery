export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  comingSoon: boolean;
}

export const games: Game[] = [
  {
    id: "game-1",
    title: "Game 1",
    description: "An exciting hackathon game. Stay tuned!",
    thumbnail: "/games/game-1/thumbnail.png",
    comingSoon: true,
  },
  {
    id: "game-2",
    title: "Game 2",
    description: "An exciting hackathon game. Stay tuned!",
    thumbnail: "/games/game-2/thumbnail.png",
    comingSoon: true,
  },
  {
    id: "game-3",
    title: "Game 3",
    description: "An exciting hackathon game. Stay tuned!",
    thumbnail: "/games/game-3/thumbnail.png",
    comingSoon: true,
  },
  {
    id: "game-4",
    title: "Game 4",
    description: "An exciting hackathon game. Stay tuned!",
    thumbnail: "/games/game-4/thumbnail.png",
    comingSoon: true,
  },
  {
    id: "game-5",
    title: "Game 5",
    description: "An exciting hackathon game. Stay tuned!",
    thumbnail: "/games/game-5/thumbnail.png",
    comingSoon: true,
  },
  {
    id: "game-6",
    title: "Game 6",
    description: "An exciting hackathon game. Stay tuned!",
    thumbnail: "/games/game-6/thumbnail.png",
    comingSoon: true,
  },
  {
    id: "game-7",
    title: "Game 7",
    description: "An exciting hackathon game. Stay tuned!",
    thumbnail: "/games/game-7/thumbnail.png",
    comingSoon: true,
  },
  {
    id: "game-8",
    title: "Game 8",
    description: "An exciting hackathon game. Stay tuned!",
    thumbnail: "/games/game-8/thumbnail.png",
    comingSoon: true,
  },
];

export function getGameById(id: string): Game | undefined {
  return games.find((game) => game.id === id);
}
