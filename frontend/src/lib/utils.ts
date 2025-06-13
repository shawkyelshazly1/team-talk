import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


// Utility function to convert HSL to Hex
const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number): string => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const generateColorFromUsername = (username: string, saturation = 70, lightness = 50): { backgroundColor: string, textColor: string; } => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  const backgroundColor = hslToHex(hue, saturation, lightness);

  // Simple rule: if lightness > 60, use black text, otherwise white
  const textColor = lightness > 60 ? '#000000' : '#FFFFFF';

  return {
    backgroundColor,
    textColor
  };
};