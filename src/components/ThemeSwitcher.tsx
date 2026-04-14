"use client";

import { useState } from "react";
import { themes } from "@/lib/themes";
import { useTheme } from "./ThemeProvider";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div
          className="absolute bottom-14 right-0 w-72 rounded-lg border-2 p-3"
          style={{
            backgroundColor: "var(--color-bg)",
            borderColor: "var(--color-accent1)",
            boxShadow: `0 0 20px var(--color-glow1), 0 0 40px var(--color-glow1)`,
          }}
        >
          <p
            className="mb-3 font-pixel text-xs uppercase tracking-wider"
            style={{ color: "var(--color-accent1)" }}
          >
            Select Theme
          </p>
          <div className="flex flex-col gap-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 rounded-md border px-3 py-2 text-left transition-all"
                style={{
                  borderColor:
                    theme.id === t.id
                      ? t.colors.accent1
                      : t.colors.cardBorder,
                  backgroundColor:
                    theme.id === t.id ? t.colors.card : "transparent",
                  boxShadow:
                    theme.id === t.id
                      ? `0 0 10px ${t.colors.glow1}`
                      : "none",
                }}
              >
                <div className="flex shrink-0 gap-1">
                  <span
                    className="block h-3 w-3 rounded-full"
                    style={{ backgroundColor: t.colors.accent1 }}
                  />
                  <span
                    className="block h-3 w-3 rounded-full"
                    style={{ backgroundColor: t.colors.accent2 }}
                  />
                  <span
                    className="block h-3 w-3 rounded-full"
                    style={{ backgroundColor: t.colors.accent3 }}
                  />
                </div>
                <div>
                  <p
                    className="font-pixel text-[10px]"
                    style={{
                      color:
                        theme.id === t.id ? t.colors.accent1 : t.colors.text,
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="font-mono text-[10px]"
                    style={{ color: t.colors.textDim }}
                  >
                    {t.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center rounded-full border-2 text-lg transition-all"
        style={{
          backgroundColor: "var(--color-bg)",
          borderColor: "var(--color-accent1)",
          color: "var(--color-accent1)",
          boxShadow: `0 0 15px var(--color-glow1)`,
        }}
        title="Switch theme"
      >
        <span className="font-pixel text-xs">T</span>
      </button>
    </div>
  );
}
