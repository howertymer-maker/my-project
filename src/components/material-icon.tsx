"use client";

import { cn } from "@/lib/utils";

type IconProps = {
  name: string;
  className?: string;
  size?: number;
  fill?: boolean;
  weight?: number;
};

/**
 * Renders a Material Symbols Outlined icon by name.
 * Uses the Material Symbols webfont loaded in the page head.
 */
export function MaterialIcon({
  name,
  className,
  size,
  fill = false,
  weight = 400,
}: IconProps) {
  const style: React.CSSProperties = {
    fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`,
  };
  if (size) {
    style.fontSize = `${size}px`;
    style.lineHeight = `${size}px`;
    style.width = `${size}px`;
    style.height = `${size}px`;
  }
  return (
    <span
      className={cn("material-symbols-outlined select-none", className)}
      style={style}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
