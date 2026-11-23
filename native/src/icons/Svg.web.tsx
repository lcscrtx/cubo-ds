import type { StrokeSvgProps } from "./Svg";

/** O mesmo desenho na web, usado na documentação. Dispensa o react-native-svg. */
export function StrokeSvg({ d, size, color, strokeWidth }: StrokeSvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d={d} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
