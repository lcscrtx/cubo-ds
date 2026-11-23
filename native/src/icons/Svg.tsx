import Svg, { Path } from "react-native-svg";

export interface StrokeSvgProps {
  d: string;
  size: number;
  color: string;
  strokeWidth: number;
}

/** Desenho do ícone no iOS e no Android. Decorativo: quem informa é o texto ao lado. */
export function StrokeSvg({ d, size, color, strokeWidth }: StrokeSvgProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none" accessible={false} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      <Path d={d} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
