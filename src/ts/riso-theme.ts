type RisoInk = {
  name: string;
  color: string;
  darkBackground?: boolean;
};

const risoInks: RisoInk[] = [
  { name: "Yellow Ink", color: "#f7ff00", darkBackground: true },
  { name: "Green Ink", color: "#00a95c" },
  { name: "Black Ink", color: "#000000" },
  { name: "Blue Ink", color: "#0078bf" },
  { name: "Red Ink", color: "#ff665e" },
  { name: "Bright Red", color: "#f15060" },
  { name: "Gold Ink", color: "#ac936e" },
  { name: "Fluorescent Pink Ink", color: "#ff48b0" },
  { name: "Light Grey", color: "#b8b8b8", darkBackground: true },
];

function pickRandomInk(): RisoInk {
  const randomValues = new Uint32Array(1);
  crypto.getRandomValues(randomValues);
  return risoInks[randomValues[0] % risoInks.length];
}

function applyRisoTheme() {
  const ink = pickRandomInk();
  const root = document.documentElement;

  root.dataset.risoInk = ink.name;
  root.style.setProperty("--ink", ink.color);
  root.style.setProperty("--muted", ink.color);
  root.style.setProperty("--color-text-primary", ink.color);
  root.style.setProperty("--color-text-secondary", ink.color);
  root.style.setProperty("--color-heading", ink.color);
  root.style.setProperty("--color-link", ink.color);
  root.style.setProperty("--color-link-hover", ink.color);

  if (ink.darkBackground) {
    root.style.setProperty("--page-background", "#000");
    root.style.setProperty("--paper", "#0b0b0b");
    root.style.setProperty("--soft", "#171717");
    root.style.setProperty("--line", "#505050");
  }
}

applyRisoTheme();
