export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    bg: string;
    bgDarker: string;
    card: string;
    cardBorder: string;
    cardBorderHover: string;
    accent1: string;
    accent2: string;
    accent3: string;
    text: string;
    textDim: string;
    headerBg: string;
    headerBorder: string;
    glow1: string;
    glow2: string;
  };
  effects: {
    scanlines: boolean;
    gridBg: boolean;
    starfield: boolean;
    crtCurve: boolean;
  };
}

export const synthwaveTheme: Theme = {
  id: "synthwave",
  name: "Synthwave",
  description: "Purple sunset gradients with hot pink accents",
  colors: {
    bg: "#1a0a2e",
    bgDarker: "#0d0519",
    card: "#1e1038",
    cardBorder: "#2a1a4e",
    cardBorderHover: "#ff2d95",
    accent1: "#ff2d95",
    accent2: "#00b4d8",
    accent3: "#ff6b35",
    text: "#e8d5f5",
    textDim: "#9977aa",
    headerBg: "#150828",
    headerBorder: "#ff2d9540",
    glow1: "#ff2d9580",
    glow2: "#00b4d880",
  },
  effects: {
    scanlines: false,
    gridBg: true,
    starfield: false,
    crtCurve: false,
  },
};

export const themes: Theme[] = [synthwaveTheme];

export const defaultTheme = synthwaveTheme;

export function getThemeById(id: string): Theme | undefined {
  return themes.find((t) => t.id === id);
}
