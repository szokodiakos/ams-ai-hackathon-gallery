import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import GameCard from "@/components/GameCard";
import type { Game } from "@/data/games";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

afterEach(() => {
  cleanup();
  mockPush.mockClear();
});

const mockGame: Game = {
  id: "test-game",
  title: "Test Game",
  teamName: "Test Team",
  description: "A test game description",
  thumbnail: "/games/test-game/thumbnail.png",
  repoUrl: "https://github.com/test/test-game",
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

  it("navigates to the game page on click", () => {
    render(<GameCard game={mockGame} />);
    const card = screen.getByRole("link", { name: /Test Game/i });
    fireEvent.click(card);
    expect(mockPush).toHaveBeenCalledWith("/games/test-game");
  });

  it("shows Coming Soon badge when game is coming soon", () => {
    render(<GameCard game={comingSoonGame} />);
    expect(screen.getByText("COMING SOON")).toBeInTheDocument();
  });

  it("does not show Coming Soon badge for available games", () => {
    render(<GameCard game={mockGame} />);
    expect(screen.queryByText("COMING SOON")).not.toBeInTheDocument();
  });

  it("renders thumbnail image for available games", () => {
    render(<GameCard game={mockGame} />);
    const img = screen.getByAltText("Test Game thumbnail");
    expect(img).toHaveAttribute("src", "/games/test-game/thumbnail.png");
  });

  it("renders a SOURCE link pointing to the repo URL", () => {
    render(<GameCard game={mockGame} />);
    const sourceLink = screen.getByText("SOURCE");
    expect(sourceLink).toBeInTheDocument();
    expect(sourceLink.closest("a")).toHaveAttribute(
      "href",
      "https://github.com/test/test-game"
    );
    expect(sourceLink.closest("a")).toHaveAttribute("target", "_blank");
    expect(sourceLink.closest("a")).toHaveAttribute(
      "rel",
      "noopener noreferrer"
    );
  });

  it("does not navigate to game page when clicking repo link", () => {
    render(<GameCard game={mockGame} />);
    const sourceLink = screen.getByText("SOURCE").closest("a")!;
    fireEvent.click(sourceLink);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("shows repo link on coming-soon game with repoUrl", () => {
    render(<GameCard game={comingSoonGame} />);
    const sourceLink = screen.getByText("SOURCE");
    expect(sourceLink).toBeInTheDocument();
  });
});
