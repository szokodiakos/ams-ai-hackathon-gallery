export interface Game {
  id: string;
  title: string;
  teamName: string;
  description: string;
  thumbnail: string;
  repoUrl: string;
  comingSoon: boolean;
}

export const games: Game[] = [
  {
    id: "gravity-well",
    title: "Gravity Well",
    teamName: "Botfathers",
    description:
      "A cyberpunk arena brawl where robot space priests fight for survival around a growing black hole. Up to 4 players battle on collapsing platforms with chaos events like gravity surges and meteor strikes. Last player standing wins.",
    thumbnail: "/games/gravity-well/thumbnail.png",
    repoUrl: "https://github.com/reaktor/botfathers",
    comingSoon: false,
  },
  {
    id: "particle-panic",
    title: "Particle Panic",
    teamName: "Al-Lian",
    description:
      "A local multiplayer collect & survive game for 2-5 players. Compete in a 2D arena with rising lava, collecting gems, dodging hazards, and shooting fireballs. Dead players drop all their gems — last one standing takes it all.",
    thumbnail: "/games/particle-panic/thumbnail.png",
    repoUrl: "https://github.com/reaktor/particle_panic",
    comingSoon: false,
  },
  {
    id: "moonshot",
    title: "Moonshot",
    teamName: "Artemis III",
    description:
      "A space-themed adventure built with Vite and Canvas. Navigate through the cosmos in this action-packed browser game crafted during the hackathon.",
    thumbnail: "/games/moonshot/thumbnail.png",
    repoUrl: "https://github.com/reaktor/TeamArtemis-GenAIHackathon",
    comingSoon: false,
  },
  {
    id: "boat-race",
    title: "Boat Race",
    teamName: "Can't Slop Won't Slop",
    description:
      "Top-down 2-player boat racing on Amsterdam canals. Physics-driven handling with anisotropic drag, powerups, a procedural sound system, and an in-game map editor. P1 uses WASD, P2 uses arrow keys.",
    thumbnail: "/games/boat-race/thumbnail.png",
    repoUrl: "https://github.com/H1D/f1-race",
    comingSoon: false,
  },
  {
    id: "colony-clash",
    title: "Colony Clash",
    teamName: "Halluci Nation",
    description:
      "Queen vs Queen — an ant colony battle arena. Choose your champion insect (Ant, Beetle, or Cockroach), fight in procedurally generated underground tunnels, and claim spawn mounds. Supports single player, local 2P, and online multiplayer.",
    thumbnail: "/games/colony-clash/thumbnail.png",
    repoUrl: "https://github.com/bmachimbira/colony-wars",
    comingSoon: false,
  },
  {
    id: "grachten-hopper",
    title: "Grachten Hopper",
    teamName: "Token My Breath Away",
    description:
      "Amsterdam Crossy Road — two players ride voxel bicycles through procedurally generated Amsterdam streets, dodging cars and canals. A scrolling camera creates constant pressure as you race toward the Rijksmuseum. Built with Three.js.",
    thumbnail: "/games/grachten-hopper/thumbnail.png",
    repoUrl: "https://github.com/reaktor/ai-hackathon-grachtenhopper",
    comingSoon: false,
  },
  {
    id: "arcane-akash",
    title: "Arcane Akash",
    teamName: "LIT Intelligence",
    description:
      "A two-player local spell duel. Cast arcane spells and outmaneuver your opponent in this magical combat game. No server needed — just open and play.",
    thumbnail: "/games/arcane-akash/thumbnail.png",
    repoUrl: "https://github.com/bsander/LIT-intelligence",
    comingSoon: false,
  },
  {
    id: "eat-that",
    title: "Eat That!",
    teamName: "Prompt-fiction",
    description:
      "A frantic food-eating competition. Mash buttons to eat as much food as you can before time runs out, but watch out for bad food! First to win 2 rounds takes the match. Features pixelated retro art and messy avatar progression.",
    thumbnail: "/games/eat-that/thumbnail.png",
    repoUrl: "https://github.com/reaktor/ams-hackathon-eat-that",
    comingSoon: false,
  },
];

export function getGameById(id: string): Game | undefined {
  return games.find((game) => game.id === id);
}
