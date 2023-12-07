import { GestureResponderEvent, PanResponderGestureState } from "react-native";
import { HsvColor, Point2D } from "./typeHelpers";
/**
 * Converts color to hsv representation.
 * @param {string} color any color represenation - name, hexa, rgb
 * @return {object} { h: number, s: number, v: number } object literal
 */
export declare function toHsv(color: string): HsvColor;
/**
 * Converts hsv object to hexa color string.
 * @param {object} hsv { h: number, s: number, v: number } object literal
 * @return {string} color in hexa representation
 */
export declare function fromHsv(hsv: HsvColor): string;
declare type PanResponderCallback = ({ x, y }: Point2D, event: GestureResponderEvent, state: PanResponderGestureState) => boolean;
/**
 * Simplified pan responder wrapper.
 */
export declare function createPanResponder({ onStart, onMove, onEnd, }: {
    onStart?: PanResponderCallback;
    onMove?: PanResponderCallback;
    onEnd?: PanResponderCallback;
}): import("react-native").PanResponderInstance;
/**
 * Rotates point around given center in 2d.
 * Point is object literal { x: number, y: number }
 * @param {point} point to be rotated
 * @param {number} angle in radians
 * @param {point} center to be rotated around
 * @return {point} rotated point
 */
export declare function rotatePoint(point: Point2D, angle: number, center?: Point2D): {
    x: number;
    y: number;
};
export {};
//# sourceMappingURL=utils.d.ts.map