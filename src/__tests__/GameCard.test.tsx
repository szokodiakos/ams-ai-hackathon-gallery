import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import GameCard from "@/components/GameCard";
import type { Game } from "@/data/games";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

afterEach(cleanup);

const mockGame: Game = {
  id: "test-game",
  title: "Test Game",
  description: "A test game description",
  thumbnail: "/games/test-game/thumbnail.png",
  comingSoon: false,
};

const comingSoonGame: Game = {
  ...mockGame,
  id: "coming-soon-game",
  title: "Coming Soon Game",
  comingSoon: true,
};

describe("GameCard", () => {
  it("renders the game title", () => {
    render(<GameCard game={mockGame} />);
    expect(screen.getByText("Test Game")).toBeInTheDocument();
  });

  it("renders the game description", () => {
    render(<GameCard game={mockGame} />);
    expect(screen.getByText("A test game description")).toBeInTheDocument();
  });

  it("links to the game page", () => {
    render(<GameCard game={mockGame} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/games/test-game");
  });

  it("shows Coming Soon badge when game is coming soon", () => {
    render(<GameCard game={comingSoonGame} />);
    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
  });

  it("does not show Coming Soon badge for available games", () => {
    render(<GameCard game={mockGame} />);
    expect(screen.queryByText("Coming Soon")).not.toBeInTheDocument();
  });

  it("renders thumbnail image for available games", () => {
    render(<GameCard game={mockGame} />);
    const img = screen.getByAltText("Test Game thumbnail");
    expect(img).toHaveAttribute("src", "/games/test-game/thumbnail.png");
  });
});
