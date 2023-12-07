import React from "react";
import { HsvColor, IPickerProps, Point2D } from "./typeHelpers";
export interface ITrianglePickerProps extends IPickerProps {
    rotationHackFactor?: number;
    hideControls?: boolean;
}
export declare type ITrianglePickerState = {
    color: HsvColor;
    pickerSize: number;
};
export declare class TriangleColorPicker extends React.PureComponent<ITrianglePickerProps, ITrianglePickerState> {
    private _layout;
    private _pageX;
    private _pageY;
    private _isRTL;
    private _pickerResponder;
    private _changingHColor;
    static defaultProps: ITrianglePickerProps;
    constructor(props: ITrianglePickerProps, ctx: any);
    _getColor(): HsvColor;
    _onColorSelected(): void;
    _onOldColorSelected(): void;
    _onSValueChange(s: any): void;
    _onVValueChange(v: any): void;
    _onColorChange(color: any): void;
    _onLayout(l: any): void;
    _computeHValue(x: number, y: number): number;
    _hValueToRad(deg: number): number;
    getColor(): string;
    _handleColorChange: ({ x, y }: Point2D) => boolean;
    _handleHColorChange({ x, y }: Point2D): void;
    _handleSVColorChange({ x, y }: {
        x: any;
        y: any;
    }): void;
    _normalizeTriangleTouch(s: any, v: any, sRatio: any): {
        s: any;
        v: any;
    };
    /**
     * Computes s, v from position (x, y). If position is outside of triangle,
     * it will return invalid values (greater than 1 or lower than 0)
     */
    _computeColorFromTriangle({ x, y }: {
        x: any;
        y: any;
    }): {
        h: number;
        s: any;
        v: any;
    };
    render(): JSX.Element;
}
//# sourceMappingURL=TriangleColorPicker.d.ts.map