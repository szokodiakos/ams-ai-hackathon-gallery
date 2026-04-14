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

export const themes: Theme[] = [
  {
    id: "neon-cyber",
    name: "Neon Cyber",
    description: "Cyan & magenta neon glows with CRT scanlines",
    colors: {
      bg: "#0a0a0f",
      bgDarker: "#050508",
      card: "#12121a",
      cardBorder: "#1a1a2e",
      cardBorderHover: "#00fff5",
      accent1: "#00fff5",
      accent2: "#ff00ff",
      accent3: "#b400ff",
      text: "#e0e0e0",
      textDim: "#888899",
      headerBg: "#08080d",
      headerBorder: "#00fff540",
      glow1: "#00fff580",
      glow2: "#ff00ff80",
    },
    effects: {
      scanlines: true,
      gridBg: true,
      starfield: false,
      crtCurve: false,
    },
  },
  {
    id: "classic-coin-op",
    name: "Classic Coin-Op",
    description: "Bright primaries inspired by 80s arcade cabinets",
    colors: {
      bg: "#000000",
      bgDarker: "#000000",
      card: "#111111",
      cardBorder: "#333333",
      cardBorderHover: "#ffd700",
      accent1: "#ff0000",
      accent2: "#ffd700",
      accent3: "#00ff00",
      text: "#ffffff",
      textDim: "#999999",
      headerBg: "#0a0a0a",
      headerBorder: "#ff000060",
      glow1: "#ff000080",
      glow2: "#ffd70080",
    },
    effects: {
      scanlines: true,
      gridBg: false,
      starfield: false,
      crtCurve: true,
    },
  },
  {
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
  },
  {
    id: "green-phosphor",
    name: "Green Phosphor",
    description: "Classic green-screen terminal CRT monitor",
    colors: {
      bg: "#001100",
      bgDarker: "#000800",
      card: "#001a00",
      cardBorder: "#003300",
      cardBorderHover: "#00ff41",
      accent1: "#00ff41",
      accent2: "#00cc33",
      accent3: "#33ff77",
      text: "#00ff41",
      textDim: "#008822",
      headerBg: "#000e00",
      headerBorder: "#00ff4140",
      glow1: "#00ff4180",
      glow2: "#00cc3380",
    },
    effects: {
      scanlines: true,
      gridBg: false,
      starfield: false,
      crtCurve: true,
    },
  },
  {
    id: "galaga-space",
    name: "Galaga Space",
    description: "Deep space navy with star-inspired purple & cyan",
    colors: {
      bg: "#0b0b2b",
      bgDarker: "#06061a",
      card: "#10103a",
      cardBorder: "#1a1a5e",
      cardBorderHover: "#18ffff",
      accent1: "#b388ff",
      accent2: "#18ffff",
      accent3: "#ffeb3b",
      text: "#d0d0ff",
      textDim: "#7777aa",
      headerBg: "#08081f",
      headerBorder: "#b388ff40",
      glow1: "#b388ff80",
      glow2: "#18ffff80",
    },
    effects: {
      scanlines: false,
      gridBg: false,
      starfield: true,
      crtCurve: false,
    },
  },
  {
    id: "vaporwave",
    name: "Vaporwave",
    description: "Pink, cyan & purple with retro-futuristic vibes",
    colors: {
      bg: "#0a0a1a",
      bgDarker: "#050510",
      card: "#12102a",
      cardBorder: "#221e3e",
      cardBorderHover: "#ff71ce",
      accent1: "#ff71ce",
      accent2: "#01cdfe",
      accent3: "#b967ff",
      text: "#e0dff0",
      textDim: "#8888aa",
      headerBg: "#080816",
      headerBorder: "#ff71ce40",
      glow1: "#ff71ce80",
      glow2: "#01cdfe80",
    },
    effects: {
      scanlines: false,
      gridBg: true,
      starfield: false,
      crtCurve: false,
    },
  },
];

export const defaultTheme = themes[0];

export function getThemeById(id: string): Theme | undefined {
  return themes.find((t) => t.id === id);
}
