import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import GameEmbed from "@/components/GameEmbed";

describe("GameEmbed", () => {
  it("renders an iframe with the correct src", () => {
    const { container } = render(<GameEmbed gameId="test-game" />);
    const iframe = container.querySelector("iframe");
    expect(iframe).toBeTruthy();
    expect(iframe!.getAttribute("src")).toBe("/games/test-game/index.html");
  });

  it("has minimum height of 600px", () => {
    const { container } = render(<GameEmbed gameId="test-game" />);
    const iframe = container.querySelector("iframe");
    expect(iframe!.style.minHeight).toBe("600px");
  });

  it("has sandbox attributes", () => {
    const { container } = render(<GameEmbed gameId="test-game" />);
    const iframe = container.querySelector("iframe");
    expect(iframe!.getAttribute("sandbox")).toContain("allow-scripts");
  });
});
