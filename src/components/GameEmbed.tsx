"use client";

import { useRef, useEffect } from "react";

export default function GameEmbed({ gameId }: { gameId: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    iframe.focus();

    const handleLoad = () => {
      iframe.focus();
    };

    iframe.addEventListener("load", handleLoad);
    return () => iframe.removeEventListener("load", handleLoad);
  }, []);

  return (
    <iframe
      ref={iframeRef}
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
