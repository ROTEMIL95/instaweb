const palettes = [
  { from: "#1a1a2e", to: "#16213e" },
  { from: "#2d1b69", to: "#11998e" },
  { from: "#1a0533", to: "#4c1d95" },
  { from: "#0f3460", to: "#16213e" },
  { from: "#2d1f0e", to: "#3a1f08" },
  { from: "#1a0505", to: "#4c0519" },
  { from: "#020617", to: "#1e40af" },
  { from: "#042f2e", to: "#134e4a" },
  { from: "#1c1917", to: "#44403c" },
  { from: "#172554", to: "#1e3a5f" },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateProfileGradient(username: string): string {
  const index = hashString(username) % palettes.length;
  const palette = palettes[index];
  return `linear-gradient(135deg, ${palette.from}, ${palette.to})`;
}
