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

  it("uses fixed positioning to fill the viewport", () => {
    const { container } = render(<GameEmbed gameId="test-game" />);
    const iframe = container.querySelector("iframe");
    expect(iframe!.className).toContain("fixed");
    expect(iframe!.className).toContain("inset-0");
    expect(iframe!.className).toContain("h-screen");
    expect(iframe!.className).toContain("w-screen");
  });

  it("has no border", () => {
    const { container } = render(<GameEmbed gameId="test-game" />);
    const iframe = container.querySelector("iframe");
    expect(iframe!.className).toContain("border-0");
  });

  it("has sandbox attributes", () => {
    const { container } = render(<GameEmbed gameId="test-game" />);
    const iframe = container.querySelector("iframe");
    expect(iframe!.getAttribute("sandbox")).toContain("allow-scripts");
  });
});
