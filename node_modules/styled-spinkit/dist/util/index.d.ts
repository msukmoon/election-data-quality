export declare const roundTo: (n: number, precision: number) => number;
export declare const size: (width: string, height?: string) => import("styled-components").FlattenSimpleInterpolation;
export declare const sizePx: (n: number) => import("styled-components").FlattenSimpleInterpolation;
export interface SizeProps {
    size: number;
}
export declare const propSize: ({ size }: SizeProps) => import("styled-components").FlattenSimpleInterpolation;
export interface BgColorProps {
    color: string;
}
export declare const propBgColor: ({ color }: BgColorProps) => import("styled-components").FlattenSimpleInterpolation;
export interface MarginProps {
    size?: number;
}
export declare const propMargin: ({ size }: MarginProps) => import("styled-components").FlattenSimpleInterpolation;
export declare const animationDelay: (n: number) => import("styled-components").FlattenSimpleInterpolation;
export interface DelayProps {
    delay: number;
}
export declare const propDelay: ({ delay }: DelayProps) => import("styled-components").FlattenSimpleInterpolation;
export declare const getRange: (n: number) => number[];
