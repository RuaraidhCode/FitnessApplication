var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import React from "react";
import { I18nManager, Image, InteractionManager, StyleSheet, TouchableOpacity, View, } from "react-native";
import tinycolor from "tinycolor2";
import { createPanResponder, rotatePoint } from "./utils";
function makeRotationKey(props, angle) {
    var rotationHackFactor = props.rotationHackFactor;
    if (rotationHackFactor < 1) {
        return undefined;
    }
    var key = Math.floor(angle * rotationHackFactor);
    return "r" + key;
}
var TriangleColorPicker = /** @class */ (function (_super) {
    __extends(TriangleColorPicker, _super);
    function TriangleColorPicker(props, ctx) {
        var _this = _super.call(this, props, ctx) || this;
        _this._handleColorChange = function (_a) {
            var x = _a.x, y = _a.y;
            if (_this._changingHColor) {
                _this._handleHColorChange({ x: x, y: y });
            }
            else {
                _this._handleSVColorChange({ x: x, y: y });
            }
            return true;
        };
        var state = {
            color: { h: 0, s: 1, v: 1 },
            pickerSize: null,
        };
        if (props.oldColor) {
            state.color = tinycolor(props.oldColor).toHsv();
        }
        if (props.defaultColor) {
            state.color = tinycolor(props.defaultColor).toHsv();
        }
        _this.state = state;
        _this._layout = { width: 0, height: 0, x: 0, y: 0 };
        _this._pageX = 0;
        _this._pageY = 0;
        _this._onLayout = _this._onLayout.bind(_this);
        _this._onSValueChange = _this._onSValueChange.bind(_this);
        _this._onVValueChange = _this._onVValueChange.bind(_this);
        _this._onColorSelected = _this._onColorSelected.bind(_this);
        _this._onOldColorSelected = _this._onOldColorSelected.bind(_this);
        _this._isRTL = I18nManager.isRTL;
        _this._pickerResponder = createPanResponder({
            onStart: function (_a) {
                var x = _a.x, y = _a.y;
                var _b = _this._computeColorFromTriangle({ x: x, y: y }), s = _b.s, v = _b.v;
                _this._changingHColor = s > 1 || s < 0 || v > 1 || v < 0;
                _this._handleColorChange({ x: x, y: y });
                return true;
            },
            onMove: _this._handleColorChange,
        });
        return _this;
    }
    TriangleColorPicker.prototype._getColor = function () {
        var passedColor = typeof this.props.color === "string"
            ? tinycolor(this.props.color).toHsv()
            : this.props.color;
        return passedColor || this.state.color;
    };
    TriangleColorPicker.prototype._onColorSelected = function () {
        var onColorSelected = this.props.onColorSelected;
        var color = tinycolor(this._getColor()).toHexString();
        onColorSelected && onColorSelected(color);
    };
    TriangleColorPicker.prototype._onOldColorSelected = function () {
        var _a = this.props, oldColor = _a.oldColor, onOldColorSelected = _a.onOldColorSelected;
        var color = tinycolor(oldColor);
        this.setState({ color: color.toHsv() });
        onOldColorSelected && onOldColorSelected(color.toHexString());
    };
    TriangleColorPicker.prototype._onSValueChange = function (s) {
        var _a = this._getColor(), h = _a.h, v = _a.v;
        this._onColorChange({ h: h, s: s, v: v });
    };
    TriangleColorPicker.prototype._onVValueChange = function (v) {
        var _a = this._getColor(), h = _a.h, s = _a.s;
        this._onColorChange({ h: h, s: s, v: v });
    };
    TriangleColorPicker.prototype._onColorChange = function (color) {
        this.setState({ color: color });
        if (this.props.onColorChange) {
            this.props.onColorChange(color);
        }
    };
    TriangleColorPicker.prototype._onLayout = function (l) {
        var _this = this;
        this._layout = l.nativeEvent.layout;
        var _a = this._layout, width = _a.width, height = _a.height;
        var pickerSize = Math.min(width, height);
        if (this.state.pickerSize !== pickerSize) {
            this.setState({ pickerSize: pickerSize });
        }
        // layout.x, layout.y is always 0
        // we always measure because layout is the same even though picker is moved on the page
        InteractionManager.runAfterInteractions(function () {
            // measure only after (possible) animation ended
            _this.refs.pickerContainer &&
                _this.refs.pickerContainer.measure(function (x, y, width, height, pageX, pageY) {
                    // picker position in the screen
                    _this._pageX = pageX;
                    _this._pageY = pageY;
                });
        });
    };
    TriangleColorPicker.prototype._computeHValue = function (x, y) {
        var mx = this.state.pickerSize / 2;
        var my = this.state.pickerSize / 2;
        var dx = x - mx;
        var dy = y - my;
        var rad = Math.atan2(dx, dy) + Math.PI + Math.PI / 2;
        return ((rad * 180) / Math.PI) % 360;
    };
    TriangleColorPicker.prototype._hValueToRad = function (deg) {
        var rad = (deg * Math.PI) / 180;
        return rad - Math.PI - Math.PI / 2;
    };
    TriangleColorPicker.prototype.getColor = function () {
        return tinycolor(this._getColor()).toHexString();
    };
    TriangleColorPicker.prototype._handleHColorChange = function (_a) {
        var x = _a.x, y = _a.y;
        var _b = this._getColor(), s = _b.s, v = _b.v;
        var marginLeft = (this._layout.width - this.state.pickerSize) / 2;
        var marginTop = (this._layout.height - this.state.pickerSize) / 2;
        var relativeX = x - this._pageX - marginLeft;
        var relativeY = y - this._pageY - marginTop;
        var h = this._computeHValue(relativeX, relativeY);
        this._onColorChange({ h: h, s: s, v: v });
    };
    TriangleColorPicker.prototype._handleSVColorChange = function (_a) {
        var x = _a.x, y = _a.y;
        var _b = this._computeColorFromTriangle({ x: x, y: y }), h = _b.h, rawS = _b.s, rawV = _b.v;
        var s = Math.min(Math.max(0, rawS), 1);
        var v = Math.min(Math.max(0, rawV), 1);
        this._onColorChange({ h: h, s: s, v: v });
    };
    TriangleColorPicker.prototype._normalizeTriangleTouch = function (s, v, sRatio) {
        var CORNER_ZONE_SIZE = 0.12; // relative size to be considered as corner zone
        var NORMAL_MARGIN = 0.1; // relative triangle margin to be considered as touch in triangle
        var CORNER_MARGIN = 0.05; // relative triangle margin to be considered as touch in triangle in corner zone
        var margin = NORMAL_MARGIN;
        var posNS = v > 0 ? 1 - (1 - s) * sRatio : 1 - s * sRatio;
        var negNS = v > 0 ? s * sRatio : (1 - s) * sRatio;
        var ns = s > 1 ? posNS : negNS; // normalized s value according to ratio and s value
        var rightCorner = s > 1 - CORNER_ZONE_SIZE && v > 1 - CORNER_ZONE_SIZE;
        var leftCorner = ns < 0 + CORNER_ZONE_SIZE && v > 1 - CORNER_ZONE_SIZE;
        var topCorner = ns < 0 + CORNER_ZONE_SIZE && v < 0 + CORNER_ZONE_SIZE;
        if (rightCorner) {
            return { s: s, v: v };
        }
        if (leftCorner || topCorner) {
            margin = CORNER_MARGIN;
        }
        // color normalization according to margin
        s = s < 0 && ns > 0 - margin ? 0 : s;
        s = s > 1 && ns < 1 + margin ? 1 : s;
        v = v < 0 && v > 0 - margin ? 0 : v;
        v = v > 1 && v < 1 + margin ? 1 : v;
        return { s: s, v: v };
    };
    /**
     * Computes s, v from position (x, y). If position is outside of triangle,
     * it will return invalid values (greater than 1 or lower than 0)
     */
    TriangleColorPicker.prototype._computeColorFromTriangle = function (_a) {
        var x = _a.x, y = _a.y;
        var pickerSize = this.state.pickerSize;
        var _b = getPickerProperties(pickerSize), triangleHeight = _b.triangleHeight, triangleWidth = _b.triangleWidth;
        var left = pickerSize / 2 - triangleWidth / 2;
        var top = pickerSize / 2 - (2 * triangleHeight) / 3;
        // triangle relative coordinates
        var marginLeft = (this._layout.width - this.state.pickerSize) / 2;
        var marginTop = (this._layout.height - this.state.pickerSize) / 2;
        var relativeX = x - this._pageX - marginLeft - left;
        var relativeY = y - this._pageY - marginTop - top;
        // rotation
        var h = this._getColor().h;
        var deg = (h - 330 + 360) % 360; // starting angle is 330 due to comfortable calculation
        var rad = (deg * Math.PI) / 180;
        var center = {
            x: triangleWidth / 2,
            y: (2 * triangleHeight) / 3,
        };
        var rotated = rotatePoint({ x: relativeX, y: relativeY }, rad, center);
        var line = (triangleWidth * rotated.y) / triangleHeight;
        var margin = triangleWidth / 2 - ((triangleWidth / 2) * rotated.y) / triangleHeight;
        var s = (rotated.x - margin) / line;
        var v = rotated.y / triangleHeight;
        // normalize
        var normalized = this._normalizeTriangleTouch(s, v, line / triangleHeight);
        return { h: h, s: normalized.s, v: normalized.v };
    };
    TriangleColorPicker.prototype.render = function () {
        var pickerSize = this.state.pickerSize;
        var _a = this.props, oldColor = _a.oldColor, style = _a.style;
        var color = this._getColor();
        var h = color.h;
        var angle = this._hValueToRad(h);
        var selectedColor = tinycolor(color).toHexString();
        var indicatorColor = tinycolor({ h: h, s: 1, v: 1 }).toHexString();
        var computed = makeComputedStyles({
            pickerSize: pickerSize,
            selectedColorHsv: color,
            indicatorColor: indicatorColor,
            angle: angle,
            isRTL: this._isRTL,
        });
        // Hack for https://github.com/instea/react-native-color-picker/issues/17
        var rotationHack = makeRotationKey(this.props, angle);
        return (<View style={style}>
        <View onLayout={this._onLayout} ref="pickerContainer" style={styles.pickerContainer}>
          {!pickerSize ? null : (<View>
              <View key={rotationHack} style={[styles.triangleContainer, computed.triangleContainer]}>
                <View style={[
            styles.triangleUnderlayingColor,
            computed.triangleUnderlayingColor,
        ]}/>
                <Image style={[computed.triangleImage]} source={require("../resources/hsv_triangle_mask.png")}/>
              </View>
              <View {...this._pickerResponder.panHandlers} style={[computed.picker]} collapsable={false}>
                <Image source={require("../resources/color-circle.png")} resizeMode="contain" style={[styles.pickerImage]}/>
                <View key={rotationHack} style={[styles.pickerIndicator, computed.pickerIndicator]}>
                  <View style={[
            styles.pickerIndicatorTick,
            computed.pickerIndicatorTick,
        ]}/>
                </View>
                <View style={[styles.svIndicator, computed.svIndicator]}/>
              </View>
            </View>)}
        </View>
        {this.props.hideControls == true ? null : (<View style={[styles.colorPreviews, computed.colorPreviews]}>
            {oldColor && (<TouchableOpacity style={[styles.colorPreview, { backgroundColor: oldColor }]} onPress={this._onOldColorSelected} activeOpacity={0.7}/>)}
            <TouchableOpacity style={[styles.colorPreview, { backgroundColor: selectedColor }]} onPress={this._onColorSelected} activeOpacity={0.7}/>
          </View>)}
      </View>);
    };
    TriangleColorPicker.defaultProps = {
        rotationHackFactor: 100,
    };
    return TriangleColorPicker;
}(React.PureComponent));
export { TriangleColorPicker };
function getPickerProperties(pickerSize) {
    var indicatorPickerRatio = 42 / 510; // computed from picker image
    var originalIndicatorSize = indicatorPickerRatio * pickerSize;
    var indicatorSize = originalIndicatorSize;
    var pickerPadding = originalIndicatorSize / 3;
    var triangleSize = pickerSize - 6 * pickerPadding;
    var triangleRadius = triangleSize / 2;
    var triangleHeight = (triangleRadius * 3) / 2;
    var triangleWidth = 2 * triangleRadius * Math.sqrt(3 / 4); // pythagorean theorem
    return {
        triangleSize: triangleSize,
        triangleRadius: triangleRadius,
        triangleHeight: triangleHeight,
        triangleWidth: triangleWidth,
        indicatorPickerRatio: indicatorPickerRatio,
        indicatorSize: indicatorSize,
        pickerPadding: pickerPadding,
    };
}
var makeComputedStyles = function (_a) {
    var _b, _c;
    var indicatorColor = _a.indicatorColor, angle = _a.angle, pickerSize = _a.pickerSize, selectedColorHsv = _a.selectedColorHsv, isRTL = _a.isRTL;
    var _d = getPickerProperties(pickerSize), triangleSize = _d.triangleSize, triangleHeight = _d.triangleHeight, triangleWidth = _d.triangleWidth, indicatorSize = _d.indicatorSize, pickerPadding = _d.pickerPadding;
    /* ===== INDICATOR ===== */
    var indicatorRadius = pickerSize / 2 - indicatorSize / 2 - pickerPadding;
    var mx = pickerSize / 2;
    var my = pickerSize / 2;
    var dx = Math.cos(angle) * indicatorRadius;
    var dy = Math.sin(angle) * indicatorRadius;
    /* ===== TRIANGLE ===== */
    var triangleTop = pickerPadding * 3;
    var triangleLeft = pickerPadding * 3;
    var triangleAngle = -angle + Math.PI / 3;
    /* ===== SV INDICATOR ===== */
    var markerColor = "rgba(0,0,0,0.8)";
    var s = selectedColorHsv.s, v = selectedColorHsv.v, h = selectedColorHsv.h;
    var svIndicatorSize = 18;
    var svY = v * triangleHeight;
    var margin = triangleWidth / 2 - v * (triangleWidth / 2);
    var svX = s * (triangleWidth - 2 * margin) + margin;
    var svIndicatorMarginLeft = (pickerSize - triangleWidth) / 2;
    var svIndicatorMarginTop = (pickerSize - (4 * triangleHeight) / 3) / 2;
    var deg = (h - 330 + 360) % 360; // starting angle is 330 due to comfortable calculation
    var rad = (deg * Math.PI) / 180;
    var center = { x: pickerSize / 2, y: pickerSize / 2 };
    var notRotatedPoint = {
        x: svIndicatorMarginTop + svY,
        y: svIndicatorMarginLeft + svX,
    };
    var svIndicatorPoint = rotatePoint(notRotatedPoint, rad, center);
    return {
        picker: {
            padding: pickerPadding,
            width: pickerSize,
            height: pickerSize,
        },
        pickerIndicator: (_b = {
                top: mx + dx - indicatorSize / 2
            },
            _b[isRTL ? "right" : "left"] = my + dy - indicatorSize / 2,
            _b.width = indicatorSize,
            _b.height = indicatorSize,
            _b.transform = [
                {
                    rotate: -angle + "rad",
                },
            ],
            _b),
        pickerIndicatorTick: {
            height: indicatorSize / 2,
            backgroundColor: markerColor,
        },
        svIndicator: (_c = {
                top: svIndicatorPoint.x - svIndicatorSize / 2
            },
            _c[isRTL ? "right" : "left"] = svIndicatorPoint.y - svIndicatorSize / 2,
            _c.width = svIndicatorSize,
            _c.height = svIndicatorSize,
            _c.borderRadius = svIndicatorSize / 2,
            _c.borderColor = markerColor,
            _c),
        triangleContainer: {
            width: triangleSize,
            height: triangleSize,
            transform: [
                {
                    rotate: triangleAngle + "rad",
                },
            ],
            top: triangleTop,
            left: triangleLeft,
        },
        triangleImage: {
            width: triangleWidth,
            height: triangleHeight,
        },
        triangleUnderlayingColor: {
            left: (triangleSize - triangleWidth) / 2,
            borderLeftWidth: triangleWidth / 2,
            borderRightWidth: triangleWidth / 2,
            borderBottomWidth: triangleHeight,
            borderBottomColor: indicatorColor,
        },
        colorPreviews: {
            height: pickerSize * 0.1,
        },
    };
};
var styles = StyleSheet.create({
    pickerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    pickerImage: {
        flex: 1,
        width: null,
        height: null,
    },
    pickerIndicator: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
    triangleContainer: {
        position: "absolute",
        alignItems: "center",
    },
    triangleUnderlayingColor: {
        position: "absolute",
        top: 0,
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
    },
    pickerAlignment: {
        alignItems: "center",
    },
    svIndicator: {
        position: "absolute",
        borderWidth: 4,
    },
    pickerIndicatorTick: {
        width: 5,
    },
    colorPreviews: {
        flexDirection: "row",
    },
    colorPreview: {
        flex: 1,
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJpYW5nbGVDb2xvclBpY2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9UcmlhbmdsZUNvbG9yUGlja2VyLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFBO0FBQ3pCLE9BQU8sRUFDTCxXQUFXLEVBQ1gsS0FBSyxFQUNMLGtCQUFrQixFQUVsQixVQUFVLEVBQ1YsZ0JBQWdCLEVBQ2hCLElBQUksR0FDTCxNQUFNLGNBQWMsQ0FBQTtBQUNyQixPQUFPLFNBQVMsTUFBTSxZQUFZLENBQUE7QUFHbEMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLFdBQVcsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUV6RCxTQUFTLGVBQWUsQ0FBQyxLQUEyQixFQUFFLEtBQWE7SUFDekQsSUFBQSxrQkFBa0IsR0FBSyxLQUFLLG1CQUFWLENBQVU7SUFFcEMsSUFBSSxrQkFBa0IsR0FBRyxDQUFDLEVBQUU7UUFDMUIsT0FBTyxTQUFTLENBQUE7S0FDakI7SUFFRCxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxDQUFBO0lBRWxELE9BQU8sTUFBSSxHQUFLLENBQUE7QUFDbEIsQ0FBQztBQVlEO0lBQXlDLHVDQUd4QztJQVlDLDZCQUFZLEtBQTJCLEVBQUUsR0FBUTtRQUFqRCxZQUNFLGtCQUFNLEtBQUssRUFBRSxHQUFHLENBQUMsU0FvQ2xCO1FBZ0ZELHdCQUFrQixHQUFHLFVBQUMsRUFBaUI7Z0JBQWYsQ0FBQyxPQUFBLEVBQUUsQ0FBQyxPQUFBO1lBQzFCLElBQUksS0FBSSxDQUFDLGVBQWUsRUFBRTtnQkFDeEIsS0FBSSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxHQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUUsQ0FBQyxDQUFBO2FBQ25DO2lCQUFNO2dCQUNMLEtBQUksQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsR0FBQSxFQUFFLENBQUMsR0FBQSxFQUFFLENBQUMsQ0FBQTthQUNwQztZQUVELE9BQU8sSUFBSSxDQUFBO1FBQ2IsQ0FBQyxDQUFDO1FBMUhBLElBQU0sS0FBSyxHQUFHO1lBQ1osS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDM0IsVUFBVSxFQUFFLElBQUk7U0FDakIsQ0FBQTtRQUVELElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtZQUNsQixLQUFLLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUE7U0FDaEQ7UUFFRCxJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUU7WUFDdEIsS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFBO1NBQ3BEO1FBRUQsS0FBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7UUFDbEIsS0FBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQTtRQUNsRCxLQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQTtRQUNmLEtBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBO1FBQ2YsS0FBSSxDQUFDLFNBQVMsR0FBRyxLQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsQ0FBQTtRQUMxQyxLQUFJLENBQUMsZUFBZSxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxDQUFBO1FBQ3RELEtBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLENBQUE7UUFDdEQsS0FBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLENBQUE7UUFDeEQsS0FBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLENBQUE7UUFDOUQsS0FBSSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFBO1FBRS9CLEtBQUksQ0FBQyxnQkFBZ0IsR0FBRyxrQkFBa0IsQ0FBQztZQUN6QyxPQUFPLEVBQUUsVUFBQyxFQUFRO29CQUFOLENBQUMsT0FBQSxFQUFFLENBQUMsT0FBQTtnQkFDUixJQUFBLEtBQVcsS0FBSSxDQUFDLHlCQUF5QixDQUFDLEVBQUUsQ0FBQyxHQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUUsQ0FBQyxFQUFqRCxDQUFDLE9BQUEsRUFBRSxDQUFDLE9BQTZDLENBQUE7Z0JBQ3pELEtBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDdkQsS0FBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxHQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUUsQ0FBQyxDQUFBO2dCQUVqQyxPQUFPLElBQUksQ0FBQTtZQUNiLENBQUM7WUFDRCxNQUFNLEVBQUUsS0FBSSxDQUFDLGtCQUFrQjtTQUNoQyxDQUFDLENBQUE7O0lBQ0osQ0FBQztJQUVELHVDQUFTLEdBQVQ7UUFDRSxJQUFNLFdBQVcsR0FDZixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLFFBQVE7WUFDbEMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRTtZQUNyQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUE7UUFDdEIsT0FBTyxXQUFXLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUE7SUFDeEMsQ0FBQztJQUVELDhDQUFnQixHQUFoQjtRQUNVLElBQUEsZUFBZSxHQUFLLElBQUksQ0FBQyxLQUFLLGdCQUFmLENBQWU7UUFDdEMsSUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBQ3ZELGVBQWUsSUFBSSxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDM0MsQ0FBQztJQUVELGlEQUFtQixHQUFuQjtRQUNRLElBQUEsS0FBbUMsSUFBSSxDQUFDLEtBQUssRUFBM0MsUUFBUSxjQUFBLEVBQUUsa0JBQWtCLHdCQUFlLENBQUE7UUFDbkQsSUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQ2pDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUN2QyxrQkFBa0IsSUFBSSxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQTtJQUMvRCxDQUFDO0lBRUQsNkNBQWUsR0FBZixVQUFnQixDQUFDO1FBQ1QsSUFBQSxLQUFXLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBekIsQ0FBQyxPQUFBLEVBQUUsQ0FBQyxPQUFxQixDQUFBO1FBQ2pDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLEdBQUEsRUFBRSxDQUFDLEdBQUEsRUFBRSxDQUFDLEdBQUEsRUFBRSxDQUFDLENBQUE7SUFDbEMsQ0FBQztJQUVELDZDQUFlLEdBQWYsVUFBZ0IsQ0FBQztRQUNULElBQUEsS0FBVyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQXpCLENBQUMsT0FBQSxFQUFFLENBQUMsT0FBcUIsQ0FBQTtRQUNqQyxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxHQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUUsQ0FBQyxDQUFBO0lBQ2xDLENBQUM7SUFFRCw0Q0FBYyxHQUFkLFVBQWUsS0FBSztRQUNsQixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFBO1FBQ3hCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUU7WUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7U0FDaEM7SUFDSCxDQUFDO0lBRUQsdUNBQVMsR0FBVCxVQUFVLENBQUM7UUFBWCxpQkFvQkM7UUFuQkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQTtRQUM3QixJQUFBLEtBQW9CLElBQUksQ0FBQyxPQUFPLEVBQTlCLEtBQUssV0FBQSxFQUFFLE1BQU0sWUFBaUIsQ0FBQTtRQUN0QyxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUMxQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLFVBQVUsRUFBRTtZQUN4QyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsVUFBVSxZQUFBLEVBQUUsQ0FBQyxDQUFBO1NBQzlCO1FBQ0QsaUNBQWlDO1FBQ2pDLHVGQUF1RjtRQUN2RixrQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQztZQUN0QyxnREFBZ0Q7WUFDaEQsS0FBSSxDQUFDLElBQUksQ0FBQyxlQUFlO2dCQUN0QixLQUFJLENBQUMsSUFBSSxDQUFDLGVBQXVCLENBQUMsT0FBTyxDQUN4QyxVQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSztvQkFDaEMsZ0NBQWdDO29CQUNoQyxLQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTtvQkFDbkIsS0FBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUE7Z0JBQ3JCLENBQUMsQ0FDRixDQUFBO1FBQ0wsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsNENBQWMsR0FBZCxVQUFlLENBQVMsRUFBRSxDQUFTO1FBQ2pDLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQTtRQUNwQyxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUE7UUFDcEMsSUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUNqQixJQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ2pCLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDdEQsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUE7SUFDdEMsQ0FBQztJQUVELDBDQUFZLEdBQVosVUFBYSxHQUFXO1FBQ3RCLElBQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDakMsT0FBTyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQTtJQUNwQyxDQUFDO0lBRUQsc0NBQVEsR0FBUjtRQUNFLE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO0lBQ2xELENBQUM7SUFZRCxpREFBbUIsR0FBbkIsVUFBb0IsRUFBaUI7WUFBZixDQUFDLE9BQUEsRUFBRSxDQUFDLE9BQUE7UUFDbEIsSUFBQSxLQUFXLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBekIsQ0FBQyxPQUFBLEVBQUUsQ0FBQyxPQUFxQixDQUFBO1FBQ2pDLElBQU0sVUFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDbkUsSUFBTSxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNuRSxJQUFNLFNBQVMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUE7UUFDOUMsSUFBTSxTQUFTLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFBO1FBQzdDLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFBO1FBQ25ELElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLEdBQUEsRUFBRSxDQUFDLEdBQUEsRUFBRSxDQUFDLEdBQUEsRUFBRSxDQUFDLENBQUE7SUFDbEMsQ0FBQztJQUVELGtEQUFvQixHQUFwQixVQUFxQixFQUFRO1lBQU4sQ0FBQyxPQUFBLEVBQUUsQ0FBQyxPQUFBO1FBQ25CLElBQUEsS0FBMEIsSUFBSSxDQUFDLHlCQUF5QixDQUFDLEVBQUUsQ0FBQyxHQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUUsQ0FBQyxFQUFoRSxDQUFDLE9BQUEsRUFBSyxJQUFJLE9BQUEsRUFBSyxJQUFJLE9BQTZDLENBQUE7UUFDeEUsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUN4QyxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ3hDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLEdBQUEsRUFBRSxDQUFDLEdBQUEsRUFBRSxDQUFDLEdBQUEsRUFBRSxDQUFDLENBQUE7SUFDbEMsQ0FBQztJQUVELHFEQUF1QixHQUF2QixVQUF3QixDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU07UUFDbEMsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUEsQ0FBQyxnREFBZ0Q7UUFDOUUsSUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFBLENBQUMsaUVBQWlFO1FBQzNGLElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQSxDQUFDLGdGQUFnRjtRQUMzRyxJQUFJLE1BQU0sR0FBRyxhQUFhLENBQUE7UUFFMUIsSUFBTSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUE7UUFDM0QsSUFBTSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFBO1FBQ25ELElBQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFBLENBQUMsb0RBQW9EO1FBRXJGLElBQU0sV0FBVyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsZ0JBQWdCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQTtRQUN4RSxJQUFNLFVBQVUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLGdCQUFnQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsZ0JBQWdCLENBQUE7UUFDeEUsSUFBTSxTQUFTLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxnQkFBZ0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLGdCQUFnQixDQUFBO1FBQ3ZFLElBQUksV0FBVyxFQUFFO1lBQ2YsT0FBTyxFQUFFLENBQUMsR0FBQSxFQUFFLENBQUMsR0FBQSxFQUFFLENBQUE7U0FDaEI7UUFDRCxJQUFJLFVBQVUsSUFBSSxTQUFTLEVBQUU7WUFDM0IsTUFBTSxHQUFHLGFBQWEsQ0FBQTtTQUN2QjtRQUNELDBDQUEwQztRQUMxQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDcEMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3BDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNuQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkMsT0FBTyxFQUFFLENBQUMsR0FBQSxFQUFFLENBQUMsR0FBQSxFQUFFLENBQUE7SUFDakIsQ0FBQztJQUVEOzs7T0FHRztJQUNILHVEQUF5QixHQUF6QixVQUEwQixFQUFRO1lBQU4sQ0FBQyxPQUFBLEVBQUUsQ0FBQyxPQUFBO1FBQ3RCLElBQUEsVUFBVSxHQUFLLElBQUksQ0FBQyxLQUFLLFdBQWYsQ0FBZTtRQUMzQixJQUFBLEtBQW9DLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxFQUFqRSxjQUFjLG9CQUFBLEVBQUUsYUFBYSxtQkFBb0MsQ0FBQTtRQUV6RSxJQUFNLElBQUksR0FBRyxVQUFVLEdBQUcsQ0FBQyxHQUFHLGFBQWEsR0FBRyxDQUFDLENBQUE7UUFDL0MsSUFBTSxHQUFHLEdBQUcsVUFBVSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUE7UUFFckQsZ0NBQWdDO1FBQ2hDLElBQU0sVUFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDbkUsSUFBTSxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNuRSxJQUFNLFNBQVMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLEdBQUcsSUFBSSxDQUFBO1FBQ3JELElBQU0sU0FBUyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsR0FBRyxHQUFHLENBQUE7UUFFbkQsV0FBVztRQUNILElBQUEsQ0FBQyxHQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBckIsQ0FBcUI7UUFDOUIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQSxDQUFDLHVEQUF1RDtRQUN6RixJQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQ2pDLElBQU0sTUFBTSxHQUFHO1lBQ2IsQ0FBQyxFQUFFLGFBQWEsR0FBRyxDQUFDO1lBQ3BCLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDO1NBQzVCLENBQUE7UUFDRCxJQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFFeEUsSUFBTSxJQUFJLEdBQUcsQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLGNBQWMsQ0FBQTtRQUN6RCxJQUFNLE1BQU0sR0FDVixhQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLGNBQWMsQ0FBQTtRQUN4RSxJQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFBO1FBQ3JDLElBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFBO1FBRXBDLFlBQVk7UUFDWixJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQzdDLENBQUMsRUFDRCxDQUFDLEVBQ0QsSUFBSSxHQUFHLGNBQWMsQ0FDdEIsQ0FBQTtRQUVELE9BQU8sRUFBRSxDQUFDLEdBQUEsRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFBO0lBQ2hELENBQUM7SUFFRCxvQ0FBTSxHQUFOO1FBQ1UsSUFBQSxVQUFVLEdBQUssSUFBSSxDQUFDLEtBQUssV0FBZixDQUFlO1FBQzNCLElBQUEsS0FBc0IsSUFBSSxDQUFDLEtBQUssRUFBOUIsUUFBUSxjQUFBLEVBQUUsS0FBSyxXQUFlLENBQUE7UUFDdEMsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO1FBQ3RCLElBQUEsQ0FBQyxHQUFLLEtBQUssRUFBVixDQUFVO1FBQ25CLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbEMsSUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBQ3BELElBQU0sY0FBYyxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsR0FBQSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7UUFDakUsSUFBTSxRQUFRLEdBQUcsa0JBQWtCLENBQUM7WUFDbEMsVUFBVSxZQUFBO1lBQ1YsZ0JBQWdCLEVBQUUsS0FBSztZQUN2QixjQUFjLGdCQUFBO1lBQ2QsS0FBSyxPQUFBO1lBQ0wsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNO1NBQ25CLENBQUMsQ0FBQTtRQUNGLHlFQUF5RTtRQUN6RSxJQUFNLFlBQVksR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUN2RCxPQUFPLENBQ0wsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ2pCO1FBQUEsQ0FBQyxJQUFJLENBQ0gsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUN6QixHQUFHLENBQUMsaUJBQWlCLENBQ3JCLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FFOUI7VUFBQSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQ3BCLENBQUMsSUFBSSxDQUNIO2NBQUEsQ0FBQyxJQUFJLENBQ0gsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQ2xCLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBRTlEO2dCQUFBLENBQUMsSUFBSSxDQUNILEtBQUssQ0FBQyxDQUFDO1lBQ0wsTUFBTSxDQUFDLHdCQUF3QjtZQUMvQixRQUFRLENBQUMsd0JBQXdCO1NBQ2xDLENBQUMsRUFFSjtnQkFBQSxDQUFDLEtBQUssQ0FDSixLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUNoQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsb0NBQW9DLENBQUMsQ0FBQyxFQUUxRDtjQUFBLEVBQUUsSUFBSSxDQUNOO2NBQUEsQ0FBQyxJQUFJLENBQ0gsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQ3RDLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQ3pCLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUVuQjtnQkFBQSxDQUFDLEtBQUssQ0FDSixNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQyxDQUNqRCxVQUFVLENBQUMsU0FBUyxDQUNwQixLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUU5QjtnQkFBQSxDQUFDLElBQUksQ0FDSCxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FDbEIsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUUxRDtrQkFBQSxDQUFDLElBQUksQ0FDSCxLQUFLLENBQUMsQ0FBQztZQUNMLE1BQU0sQ0FBQyxtQkFBbUI7WUFDMUIsUUFBUSxDQUFDLG1CQUFtQjtTQUM3QixDQUFDLEVBRU47Z0JBQUEsRUFBRSxJQUFJLENBQ047Z0JBQUEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUMxRDtjQUFBLEVBQUUsSUFBSSxDQUNSO1lBQUEsRUFBRSxJQUFJLENBQUMsQ0FDUixDQUNIO1FBQUEsRUFBRSxJQUFJLENBQ047UUFBQSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUN4QyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQzFEO1lBQUEsQ0FBQyxRQUFRLElBQUksQ0FDWCxDQUFDLGdCQUFnQixDQUNmLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQzVELE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUNsQyxhQUFhLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFDbkIsQ0FDSCxDQUNEO1lBQUEsQ0FBQyxnQkFBZ0IsQ0FDZixLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUNqRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FDL0IsYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBRXZCO1VBQUEsRUFBRSxJQUFJLENBQUMsQ0FDUixDQUNIO01BQUEsRUFBRSxJQUFJLENBQUMsQ0FDUixDQUFBO0lBQ0gsQ0FBQztJQS9TYSxnQ0FBWSxHQUF5QjtRQUNqRCxrQkFBa0IsRUFBRSxHQUFHO0tBQ3hCLENBQUM7SUE4U0osMEJBQUM7Q0FBQSxBQTNURCxDQUF5QyxLQUFLLENBQUMsYUFBYSxHQTJUM0Q7U0EzVFksbUJBQW1CO0FBNlRoQyxTQUFTLG1CQUFtQixDQUFDLFVBQVU7SUFDckMsSUFBTSxvQkFBb0IsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFBLENBQUMsNkJBQTZCO0lBQ25FLElBQU0scUJBQXFCLEdBQUcsb0JBQW9CLEdBQUcsVUFBVSxDQUFBO0lBQy9ELElBQU0sYUFBYSxHQUFHLHFCQUFxQixDQUFBO0lBQzNDLElBQU0sYUFBYSxHQUFHLHFCQUFxQixHQUFHLENBQUMsQ0FBQTtJQUUvQyxJQUFNLFlBQVksR0FBRyxVQUFVLEdBQUcsQ0FBQyxHQUFHLGFBQWEsQ0FBQTtJQUNuRCxJQUFNLGNBQWMsR0FBRyxZQUFZLEdBQUcsQ0FBQyxDQUFBO0lBQ3ZDLElBQU0sY0FBYyxHQUFHLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUMvQyxJQUFNLGFBQWEsR0FBRyxDQUFDLEdBQUcsY0FBYyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBLENBQUMsc0JBQXNCO0lBRWxGLE9BQU87UUFDTCxZQUFZLGNBQUE7UUFDWixjQUFjLGdCQUFBO1FBQ2QsY0FBYyxnQkFBQTtRQUNkLGFBQWEsZUFBQTtRQUNiLG9CQUFvQixzQkFBQTtRQUNwQixhQUFhLGVBQUE7UUFDYixhQUFhLGVBQUE7S0FDZCxDQUFBO0FBQ0gsQ0FBQztBQUVELElBQU0sa0JBQWtCLEdBQUcsVUFBQyxFQU0zQjs7UUFMQyxjQUFjLG9CQUFBLEVBQ2QsS0FBSyxXQUFBLEVBQ0wsVUFBVSxnQkFBQSxFQUNWLGdCQUFnQixzQkFBQSxFQUNoQixLQUFLLFdBQUE7SUFFQyxJQUFBLEtBTUYsbUJBQW1CLENBQUMsVUFBVSxDQUFDLEVBTGpDLFlBQVksa0JBQUEsRUFDWixjQUFjLG9CQUFBLEVBQ2QsYUFBYSxtQkFBQSxFQUNiLGFBQWEsbUJBQUEsRUFDYixhQUFhLG1CQUNvQixDQUFBO0lBRW5DLDJCQUEyQjtJQUMzQixJQUFNLGVBQWUsR0FBRyxVQUFVLEdBQUcsQ0FBQyxHQUFHLGFBQWEsR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFBO0lBQzFFLElBQU0sRUFBRSxHQUFHLFVBQVUsR0FBRyxDQUFDLENBQUE7SUFDekIsSUFBTSxFQUFFLEdBQUcsVUFBVSxHQUFHLENBQUMsQ0FBQTtJQUN6QixJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLGVBQWUsQ0FBQTtJQUM1QyxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLGVBQWUsQ0FBQTtJQUU1QywwQkFBMEI7SUFDMUIsSUFBTSxXQUFXLEdBQUcsYUFBYSxHQUFHLENBQUMsQ0FBQTtJQUNyQyxJQUFNLFlBQVksR0FBRyxhQUFhLEdBQUcsQ0FBQyxDQUFBO0lBQ3RDLElBQU0sYUFBYSxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFBO0lBRTFDLDhCQUE4QjtJQUM5QixJQUFNLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQTtJQUM3QixJQUFBLENBQUMsR0FBVyxnQkFBZ0IsRUFBM0IsRUFBRSxDQUFDLEdBQVEsZ0JBQWdCLEVBQXhCLEVBQUUsQ0FBQyxHQUFLLGdCQUFnQixFQUFyQixDQUFxQjtJQUNwQyxJQUFNLGVBQWUsR0FBRyxFQUFFLENBQUE7SUFDMUIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLGNBQWMsQ0FBQTtJQUM5QixJQUFNLE1BQU0sR0FBRyxhQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUMxRCxJQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQTtJQUNyRCxJQUFNLHFCQUFxQixHQUFHLENBQUMsVUFBVSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUM5RCxJQUFNLG9CQUFvQixHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUV4RSxJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFBLENBQUMsdURBQXVEO0lBQ3pGLElBQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUE7SUFDakMsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUUsVUFBVSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxHQUFHLENBQUMsRUFBRSxDQUFBO0lBQ3ZELElBQU0sZUFBZSxHQUFHO1FBQ3RCLENBQUMsRUFBRSxvQkFBb0IsR0FBRyxHQUFHO1FBQzdCLENBQUMsRUFBRSxxQkFBcUIsR0FBRyxHQUFHO0tBQy9CLENBQUE7SUFDRCxJQUFNLGdCQUFnQixHQUFHLFdBQVcsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFBO0lBRWxFLE9BQU87UUFDTCxNQUFNLEVBQUU7WUFDTixPQUFPLEVBQUUsYUFBYTtZQUN0QixLQUFLLEVBQUUsVUFBVTtZQUNqQixNQUFNLEVBQUUsVUFBVTtTQUNuQjtRQUNELGVBQWU7Z0JBQ2IsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsYUFBYSxHQUFHLENBQUM7O1lBQ2hDLEdBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLGFBQWEsR0FBRyxDQUFDO1lBQ3ZELFFBQUssR0FBRSxhQUFhO1lBQ3BCLFNBQU0sR0FBRSxhQUFhO1lBQ3JCLFlBQVMsR0FBRTtnQkFDVDtvQkFDRSxNQUFNLEVBQUUsQ0FBQyxLQUFLLEdBQUcsS0FBSztpQkFDdkI7YUFDRjtlQUNGO1FBQ0QsbUJBQW1CLEVBQUU7WUFDbkIsTUFBTSxFQUFFLGFBQWEsR0FBRyxDQUFDO1lBQ3pCLGVBQWUsRUFBRSxXQUFXO1NBQzdCO1FBQ0QsV0FBVztnQkFDVCxHQUFHLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxHQUFHLGVBQWUsR0FBRyxDQUFDOztZQUM3QyxHQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUcsZ0JBQWdCLENBQUMsQ0FBQyxHQUFHLGVBQWUsR0FBRyxDQUFDO1lBQ3BFLFFBQUssR0FBRSxlQUFlO1lBQ3RCLFNBQU0sR0FBRSxlQUFlO1lBQ3ZCLGVBQVksR0FBRSxlQUFlLEdBQUcsQ0FBQztZQUNqQyxjQUFXLEdBQUUsV0FBVztlQUN6QjtRQUNELGlCQUFpQixFQUFFO1lBQ2pCLEtBQUssRUFBRSxZQUFZO1lBQ25CLE1BQU0sRUFBRSxZQUFZO1lBQ3BCLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxNQUFNLEVBQUUsYUFBYSxHQUFHLEtBQUs7aUJBQzlCO2FBQ0Y7WUFDRCxHQUFHLEVBQUUsV0FBVztZQUNoQixJQUFJLEVBQUUsWUFBWTtTQUNuQjtRQUNELGFBQWEsRUFBRTtZQUNiLEtBQUssRUFBRSxhQUFhO1lBQ3BCLE1BQU0sRUFBRSxjQUFjO1NBQ3ZCO1FBQ0Qsd0JBQXdCLEVBQUU7WUFDeEIsSUFBSSxFQUFFLENBQUMsWUFBWSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUM7WUFDeEMsZUFBZSxFQUFFLGFBQWEsR0FBRyxDQUFDO1lBQ2xDLGdCQUFnQixFQUFFLGFBQWEsR0FBRyxDQUFDO1lBQ25DLGlCQUFpQixFQUFFLGNBQWM7WUFDakMsaUJBQWlCLEVBQUUsY0FBYztTQUNsQztRQUNELGFBQWEsRUFBRTtZQUNiLE1BQU0sRUFBRSxVQUFVLEdBQUcsR0FBRztTQUN6QjtLQUNGLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxJQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO0lBQy9CLGVBQWUsRUFBRTtRQUNmLElBQUksRUFBRSxDQUFDO1FBQ1AsVUFBVSxFQUFFLFFBQVE7UUFDcEIsY0FBYyxFQUFFLFFBQVE7S0FDekI7SUFDRCxXQUFXLEVBQUU7UUFDWCxJQUFJLEVBQUUsQ0FBQztRQUNQLEtBQUssRUFBRSxJQUFJO1FBQ1gsTUFBTSxFQUFFLElBQUk7S0FDYjtJQUNELGVBQWUsRUFBRTtRQUNmLFFBQVEsRUFBRSxVQUFVO1FBQ3BCLFVBQVUsRUFBRSxRQUFRO1FBQ3BCLGNBQWMsRUFBRSxRQUFRO0tBQ3pCO0lBQ0QsaUJBQWlCLEVBQUU7UUFDakIsUUFBUSxFQUFFLFVBQVU7UUFDcEIsVUFBVSxFQUFFLFFBQVE7S0FDckI7SUFDRCx3QkFBd0IsRUFBRTtRQUN4QixRQUFRLEVBQUUsVUFBVTtRQUNwQixHQUFHLEVBQUUsQ0FBQztRQUNOLEtBQUssRUFBRSxDQUFDO1FBQ1IsTUFBTSxFQUFFLENBQUM7UUFDVCxlQUFlLEVBQUUsYUFBYTtRQUM5QixXQUFXLEVBQUUsT0FBTztRQUNwQixlQUFlLEVBQUUsYUFBYTtRQUM5QixnQkFBZ0IsRUFBRSxhQUFhO0tBQ2hDO0lBQ0QsZUFBZSxFQUFFO1FBQ2YsVUFBVSxFQUFFLFFBQVE7S0FDckI7SUFDRCxXQUFXLEVBQUU7UUFDWCxRQUFRLEVBQUUsVUFBVTtRQUNwQixXQUFXLEVBQUUsQ0FBQztLQUNmO0lBQ0QsbUJBQW1CLEVBQUU7UUFDbkIsS0FBSyxFQUFFLENBQUM7S0FDVDtJQUNELGFBQWEsRUFBRTtRQUNiLGFBQWEsRUFBRSxLQUFLO0tBQ3JCO0lBQ0QsWUFBWSxFQUFFO1FBQ1osSUFBSSxFQUFFLENBQUM7S0FDUjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIlxuaW1wb3J0IHtcbiAgSTE4bk1hbmFnZXIsXG4gIEltYWdlLFxuICBJbnRlcmFjdGlvbk1hbmFnZXIsXG4gIFBhblJlc3BvbmRlckluc3RhbmNlLFxuICBTdHlsZVNoZWV0LFxuICBUb3VjaGFibGVPcGFjaXR5LFxuICBWaWV3LFxufSBmcm9tIFwicmVhY3QtbmF0aXZlXCJcbmltcG9ydCB0aW55Y29sb3IgZnJvbSBcInRpbnljb2xvcjJcIlxuXG5pbXBvcnQgeyBIc3ZDb2xvciwgSVBpY2tlclByb3BzLCBQb2ludDJEIH0gZnJvbSBcIi4vdHlwZUhlbHBlcnNcIlxuaW1wb3J0IHsgY3JlYXRlUGFuUmVzcG9uZGVyLCByb3RhdGVQb2ludCB9IGZyb20gXCIuL3V0aWxzXCJcblxuZnVuY3Rpb24gbWFrZVJvdGF0aW9uS2V5KHByb3BzOiBJVHJpYW5nbGVQaWNrZXJQcm9wcywgYW5nbGU6IG51bWJlcikge1xuICBjb25zdCB7IHJvdGF0aW9uSGFja0ZhY3RvciB9ID0gcHJvcHNcblxuICBpZiAocm90YXRpb25IYWNrRmFjdG9yIDwgMSkge1xuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfVxuXG4gIGNvbnN0IGtleSA9IE1hdGguZmxvb3IoYW5nbGUgKiByb3RhdGlvbkhhY2tGYWN0b3IpXG5cbiAgcmV0dXJuIGByJHtrZXl9YFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElUcmlhbmdsZVBpY2tlclByb3BzIGV4dGVuZHMgSVBpY2tlclByb3BzIHtcbiAgcm90YXRpb25IYWNrRmFjdG9yPzogbnVtYmVyO1xuICBoaWRlQ29udHJvbHM/OiBib29sZWFuO1xufVxuXG5leHBvcnQgdHlwZSBJVHJpYW5nbGVQaWNrZXJTdGF0ZSA9IHtcbiAgY29sb3I6IEhzdkNvbG9yO1xuICBwaWNrZXJTaXplOiBudW1iZXI7XG59O1xuXG5leHBvcnQgY2xhc3MgVHJpYW5nbGVDb2xvclBpY2tlciBleHRlbmRzIFJlYWN0LlB1cmVDb21wb25lbnQ8XG4gIElUcmlhbmdsZVBpY2tlclByb3BzLFxuICBJVHJpYW5nbGVQaWNrZXJTdGF0ZVxuPiB7XG4gIHByaXZhdGUgX2xheW91dDogeyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlcjsgeDogbnVtYmVyOyB5OiBudW1iZXIgfTtcbiAgcHJpdmF0ZSBfcGFnZVg6IG51bWJlcjtcbiAgcHJpdmF0ZSBfcGFnZVk6IG51bWJlcjtcbiAgcHJpdmF0ZSBfaXNSVEw6IGJvb2xlYW47XG4gIHByaXZhdGUgX3BpY2tlclJlc3BvbmRlcjogUGFuUmVzcG9uZGVySW5zdGFuY2U7XG4gIHByaXZhdGUgX2NoYW5naW5nSENvbG9yOiBib29sZWFuO1xuXG4gIHB1YmxpYyBzdGF0aWMgZGVmYXVsdFByb3BzOiBJVHJpYW5nbGVQaWNrZXJQcm9wcyA9IHtcbiAgICByb3RhdGlvbkhhY2tGYWN0b3I6IDEwMCxcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogSVRyaWFuZ2xlUGlja2VyUHJvcHMsIGN0eDogYW55KSB7XG4gICAgc3VwZXIocHJvcHMsIGN0eClcblxuICAgIGNvbnN0IHN0YXRlID0ge1xuICAgICAgY29sb3I6IHsgaDogMCwgczogMSwgdjogMSB9LFxuICAgICAgcGlja2VyU2l6ZTogbnVsbCxcbiAgICB9XG5cbiAgICBpZiAocHJvcHMub2xkQ29sb3IpIHtcbiAgICAgIHN0YXRlLmNvbG9yID0gdGlueWNvbG9yKHByb3BzLm9sZENvbG9yKS50b0hzdigpXG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmRlZmF1bHRDb2xvcikge1xuICAgICAgc3RhdGUuY29sb3IgPSB0aW55Y29sb3IocHJvcHMuZGVmYXVsdENvbG9yKS50b0hzdigpXG4gICAgfVxuXG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlXG4gICAgdGhpcy5fbGF5b3V0ID0geyB3aWR0aDogMCwgaGVpZ2h0OiAwLCB4OiAwLCB5OiAwIH1cbiAgICB0aGlzLl9wYWdlWCA9IDBcbiAgICB0aGlzLl9wYWdlWSA9IDBcbiAgICB0aGlzLl9vbkxheW91dCA9IHRoaXMuX29uTGF5b3V0LmJpbmQodGhpcylcbiAgICB0aGlzLl9vblNWYWx1ZUNoYW5nZSA9IHRoaXMuX29uU1ZhbHVlQ2hhbmdlLmJpbmQodGhpcylcbiAgICB0aGlzLl9vblZWYWx1ZUNoYW5nZSA9IHRoaXMuX29uVlZhbHVlQ2hhbmdlLmJpbmQodGhpcylcbiAgICB0aGlzLl9vbkNvbG9yU2VsZWN0ZWQgPSB0aGlzLl9vbkNvbG9yU2VsZWN0ZWQuYmluZCh0aGlzKVxuICAgIHRoaXMuX29uT2xkQ29sb3JTZWxlY3RlZCA9IHRoaXMuX29uT2xkQ29sb3JTZWxlY3RlZC5iaW5kKHRoaXMpXG4gICAgdGhpcy5faXNSVEwgPSBJMThuTWFuYWdlci5pc1JUTFxuXG4gICAgdGhpcy5fcGlja2VyUmVzcG9uZGVyID0gY3JlYXRlUGFuUmVzcG9uZGVyKHtcbiAgICAgIG9uU3RhcnQ6ICh7IHgsIHkgfSkgPT4ge1xuICAgICAgICBjb25zdCB7IHMsIHYgfSA9IHRoaXMuX2NvbXB1dGVDb2xvckZyb21UcmlhbmdsZSh7IHgsIHkgfSlcbiAgICAgICAgdGhpcy5fY2hhbmdpbmdIQ29sb3IgPSBzID4gMSB8fCBzIDwgMCB8fCB2ID4gMSB8fCB2IDwgMFxuICAgICAgICB0aGlzLl9oYW5kbGVDb2xvckNoYW5nZSh7IHgsIHkgfSlcblxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSxcbiAgICAgIG9uTW92ZTogdGhpcy5faGFuZGxlQ29sb3JDaGFuZ2UsXG4gICAgfSlcbiAgfVxuXG4gIF9nZXRDb2xvcigpIHtcbiAgICBjb25zdCBwYXNzZWRDb2xvciA9XG4gICAgICB0eXBlb2YgdGhpcy5wcm9wcy5jb2xvciA9PT0gXCJzdHJpbmdcIlxuICAgICAgICA/IHRpbnljb2xvcih0aGlzLnByb3BzLmNvbG9yKS50b0hzdigpXG4gICAgICAgIDogdGhpcy5wcm9wcy5jb2xvclxuICAgIHJldHVybiBwYXNzZWRDb2xvciB8fCB0aGlzLnN0YXRlLmNvbG9yXG4gIH1cblxuICBfb25Db2xvclNlbGVjdGVkKCkge1xuICAgIGNvbnN0IHsgb25Db2xvclNlbGVjdGVkIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgY29sb3IgPSB0aW55Y29sb3IodGhpcy5fZ2V0Q29sb3IoKSkudG9IZXhTdHJpbmcoKVxuICAgIG9uQ29sb3JTZWxlY3RlZCAmJiBvbkNvbG9yU2VsZWN0ZWQoY29sb3IpXG4gIH1cblxuICBfb25PbGRDb2xvclNlbGVjdGVkKCkge1xuICAgIGNvbnN0IHsgb2xkQ29sb3IsIG9uT2xkQ29sb3JTZWxlY3RlZCB9ID0gdGhpcy5wcm9wc1xuICAgIGNvbnN0IGNvbG9yID0gdGlueWNvbG9yKG9sZENvbG9yKVxuICAgIHRoaXMuc2V0U3RhdGUoeyBjb2xvcjogY29sb3IudG9Ic3YoKSB9KVxuICAgIG9uT2xkQ29sb3JTZWxlY3RlZCAmJiBvbk9sZENvbG9yU2VsZWN0ZWQoY29sb3IudG9IZXhTdHJpbmcoKSlcbiAgfVxuXG4gIF9vblNWYWx1ZUNoYW5nZShzKSB7XG4gICAgY29uc3QgeyBoLCB2IH0gPSB0aGlzLl9nZXRDb2xvcigpXG4gICAgdGhpcy5fb25Db2xvckNoYW5nZSh7IGgsIHMsIHYgfSlcbiAgfVxuXG4gIF9vblZWYWx1ZUNoYW5nZSh2KSB7XG4gICAgY29uc3QgeyBoLCBzIH0gPSB0aGlzLl9nZXRDb2xvcigpXG4gICAgdGhpcy5fb25Db2xvckNoYW5nZSh7IGgsIHMsIHYgfSlcbiAgfVxuXG4gIF9vbkNvbG9yQ2hhbmdlKGNvbG9yKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGNvbG9yIH0pXG4gICAgaWYgKHRoaXMucHJvcHMub25Db2xvckNoYW5nZSkge1xuICAgICAgdGhpcy5wcm9wcy5vbkNvbG9yQ2hhbmdlKGNvbG9yKVxuICAgIH1cbiAgfVxuXG4gIF9vbkxheW91dChsKSB7XG4gICAgdGhpcy5fbGF5b3V0ID0gbC5uYXRpdmVFdmVudC5sYXlvdXRcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuX2xheW91dFxuICAgIGNvbnN0IHBpY2tlclNpemUgPSBNYXRoLm1pbih3aWR0aCwgaGVpZ2h0KVxuICAgIGlmICh0aGlzLnN0YXRlLnBpY2tlclNpemUgIT09IHBpY2tlclNpemUpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBwaWNrZXJTaXplIH0pXG4gICAgfVxuICAgIC8vIGxheW91dC54LCBsYXlvdXQueSBpcyBhbHdheXMgMFxuICAgIC8vIHdlIGFsd2F5cyBtZWFzdXJlIGJlY2F1c2UgbGF5b3V0IGlzIHRoZSBzYW1lIGV2ZW4gdGhvdWdoIHBpY2tlciBpcyBtb3ZlZCBvbiB0aGUgcGFnZVxuICAgIEludGVyYWN0aW9uTWFuYWdlci5ydW5BZnRlckludGVyYWN0aW9ucygoKSA9PiB7XG4gICAgICAvLyBtZWFzdXJlIG9ubHkgYWZ0ZXIgKHBvc3NpYmxlKSBhbmltYXRpb24gZW5kZWRcbiAgICAgIHRoaXMucmVmcy5waWNrZXJDb250YWluZXIgJiZcbiAgICAgICAgKHRoaXMucmVmcy5waWNrZXJDb250YWluZXIgYXMgYW55KS5tZWFzdXJlKFxuICAgICAgICAgICh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBwYWdlWCwgcGFnZVkpID0+IHtcbiAgICAgICAgICAgIC8vIHBpY2tlciBwb3NpdGlvbiBpbiB0aGUgc2NyZWVuXG4gICAgICAgICAgICB0aGlzLl9wYWdlWCA9IHBhZ2VYXG4gICAgICAgICAgICB0aGlzLl9wYWdlWSA9IHBhZ2VZXG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgfSlcbiAgfVxuXG4gIF9jb21wdXRlSFZhbHVlKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgY29uc3QgbXggPSB0aGlzLnN0YXRlLnBpY2tlclNpemUgLyAyXG4gICAgY29uc3QgbXkgPSB0aGlzLnN0YXRlLnBpY2tlclNpemUgLyAyXG4gICAgY29uc3QgZHggPSB4IC0gbXhcbiAgICBjb25zdCBkeSA9IHkgLSBteVxuICAgIGNvbnN0IHJhZCA9IE1hdGguYXRhbjIoZHgsIGR5KSArIE1hdGguUEkgKyBNYXRoLlBJIC8gMlxuICAgIHJldHVybiAoKHJhZCAqIDE4MCkgLyBNYXRoLlBJKSAlIDM2MFxuICB9XG5cbiAgX2hWYWx1ZVRvUmFkKGRlZzogbnVtYmVyKSB7XG4gICAgY29uc3QgcmFkID0gKGRlZyAqIE1hdGguUEkpIC8gMTgwXG4gICAgcmV0dXJuIHJhZCAtIE1hdGguUEkgLSBNYXRoLlBJIC8gMlxuICB9XG5cbiAgZ2V0Q29sb3IoKSB7XG4gICAgcmV0dXJuIHRpbnljb2xvcih0aGlzLl9nZXRDb2xvcigpKS50b0hleFN0cmluZygpXG4gIH1cblxuICBfaGFuZGxlQ29sb3JDaGFuZ2UgPSAoeyB4LCB5IH06IFBvaW50MkQpID0+IHtcbiAgICBpZiAodGhpcy5fY2hhbmdpbmdIQ29sb3IpIHtcbiAgICAgIHRoaXMuX2hhbmRsZUhDb2xvckNoYW5nZSh7IHgsIHkgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faGFuZGxlU1ZDb2xvckNoYW5nZSh7IHgsIHkgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZVxuICB9O1xuXG4gIF9oYW5kbGVIQ29sb3JDaGFuZ2UoeyB4LCB5IH06IFBvaW50MkQpIHtcbiAgICBjb25zdCB7IHMsIHYgfSA9IHRoaXMuX2dldENvbG9yKClcbiAgICBjb25zdCBtYXJnaW5MZWZ0ID0gKHRoaXMuX2xheW91dC53aWR0aCAtIHRoaXMuc3RhdGUucGlja2VyU2l6ZSkgLyAyXG4gICAgY29uc3QgbWFyZ2luVG9wID0gKHRoaXMuX2xheW91dC5oZWlnaHQgLSB0aGlzLnN0YXRlLnBpY2tlclNpemUpIC8gMlxuICAgIGNvbnN0IHJlbGF0aXZlWCA9IHggLSB0aGlzLl9wYWdlWCAtIG1hcmdpbkxlZnRcbiAgICBjb25zdCByZWxhdGl2ZVkgPSB5IC0gdGhpcy5fcGFnZVkgLSBtYXJnaW5Ub3BcbiAgICBjb25zdCBoID0gdGhpcy5fY29tcHV0ZUhWYWx1ZShyZWxhdGl2ZVgsIHJlbGF0aXZlWSlcbiAgICB0aGlzLl9vbkNvbG9yQ2hhbmdlKHsgaCwgcywgdiB9KVxuICB9XG5cbiAgX2hhbmRsZVNWQ29sb3JDaGFuZ2UoeyB4LCB5IH0pIHtcbiAgICBjb25zdCB7IGgsIHM6IHJhd1MsIHY6IHJhd1YgfSA9IHRoaXMuX2NvbXB1dGVDb2xvckZyb21UcmlhbmdsZSh7IHgsIHkgfSlcbiAgICBjb25zdCBzID0gTWF0aC5taW4oTWF0aC5tYXgoMCwgcmF3UyksIDEpXG4gICAgY29uc3QgdiA9IE1hdGgubWluKE1hdGgubWF4KDAsIHJhd1YpLCAxKVxuICAgIHRoaXMuX29uQ29sb3JDaGFuZ2UoeyBoLCBzLCB2IH0pXG4gIH1cblxuICBfbm9ybWFsaXplVHJpYW5nbGVUb3VjaChzLCB2LCBzUmF0aW8pIHtcbiAgICBjb25zdCBDT1JORVJfWk9ORV9TSVpFID0gMC4xMiAvLyByZWxhdGl2ZSBzaXplIHRvIGJlIGNvbnNpZGVyZWQgYXMgY29ybmVyIHpvbmVcbiAgICBjb25zdCBOT1JNQUxfTUFSR0lOID0gMC4xIC8vIHJlbGF0aXZlIHRyaWFuZ2xlIG1hcmdpbiB0byBiZSBjb25zaWRlcmVkIGFzIHRvdWNoIGluIHRyaWFuZ2xlXG4gICAgY29uc3QgQ09STkVSX01BUkdJTiA9IDAuMDUgLy8gcmVsYXRpdmUgdHJpYW5nbGUgbWFyZ2luIHRvIGJlIGNvbnNpZGVyZWQgYXMgdG91Y2ggaW4gdHJpYW5nbGUgaW4gY29ybmVyIHpvbmVcbiAgICBsZXQgbWFyZ2luID0gTk9STUFMX01BUkdJTlxuXG4gICAgY29uc3QgcG9zTlMgPSB2ID4gMCA/IDEgLSAoMSAtIHMpICogc1JhdGlvIDogMSAtIHMgKiBzUmF0aW9cbiAgICBjb25zdCBuZWdOUyA9IHYgPiAwID8gcyAqIHNSYXRpbyA6ICgxIC0gcykgKiBzUmF0aW9cbiAgICBjb25zdCBucyA9IHMgPiAxID8gcG9zTlMgOiBuZWdOUyAvLyBub3JtYWxpemVkIHMgdmFsdWUgYWNjb3JkaW5nIHRvIHJhdGlvIGFuZCBzIHZhbHVlXG5cbiAgICBjb25zdCByaWdodENvcm5lciA9IHMgPiAxIC0gQ09STkVSX1pPTkVfU0laRSAmJiB2ID4gMSAtIENPUk5FUl9aT05FX1NJWkVcbiAgICBjb25zdCBsZWZ0Q29ybmVyID0gbnMgPCAwICsgQ09STkVSX1pPTkVfU0laRSAmJiB2ID4gMSAtIENPUk5FUl9aT05FX1NJWkVcbiAgICBjb25zdCB0b3BDb3JuZXIgPSBucyA8IDAgKyBDT1JORVJfWk9ORV9TSVpFICYmIHYgPCAwICsgQ09STkVSX1pPTkVfU0laRVxuICAgIGlmIChyaWdodENvcm5lcikge1xuICAgICAgcmV0dXJuIHsgcywgdiB9XG4gICAgfVxuICAgIGlmIChsZWZ0Q29ybmVyIHx8IHRvcENvcm5lcikge1xuICAgICAgbWFyZ2luID0gQ09STkVSX01BUkdJTlxuICAgIH1cbiAgICAvLyBjb2xvciBub3JtYWxpemF0aW9uIGFjY29yZGluZyB0byBtYXJnaW5cbiAgICBzID0gcyA8IDAgJiYgbnMgPiAwIC0gbWFyZ2luID8gMCA6IHNcbiAgICBzID0gcyA+IDEgJiYgbnMgPCAxICsgbWFyZ2luID8gMSA6IHNcbiAgICB2ID0gdiA8IDAgJiYgdiA+IDAgLSBtYXJnaW4gPyAwIDogdlxuICAgIHYgPSB2ID4gMSAmJiB2IDwgMSArIG1hcmdpbiA/IDEgOiB2XG4gICAgcmV0dXJuIHsgcywgdiB9XG4gIH1cblxuICAvKipcbiAgICogQ29tcHV0ZXMgcywgdiBmcm9tIHBvc2l0aW9uICh4LCB5KS4gSWYgcG9zaXRpb24gaXMgb3V0c2lkZSBvZiB0cmlhbmdsZSxcbiAgICogaXQgd2lsbCByZXR1cm4gaW52YWxpZCB2YWx1ZXMgKGdyZWF0ZXIgdGhhbiAxIG9yIGxvd2VyIHRoYW4gMClcbiAgICovXG4gIF9jb21wdXRlQ29sb3JGcm9tVHJpYW5nbGUoeyB4LCB5IH0pIHtcbiAgICBjb25zdCB7IHBpY2tlclNpemUgfSA9IHRoaXMuc3RhdGVcbiAgICBjb25zdCB7IHRyaWFuZ2xlSGVpZ2h0LCB0cmlhbmdsZVdpZHRoIH0gPSBnZXRQaWNrZXJQcm9wZXJ0aWVzKHBpY2tlclNpemUpXG5cbiAgICBjb25zdCBsZWZ0ID0gcGlja2VyU2l6ZSAvIDIgLSB0cmlhbmdsZVdpZHRoIC8gMlxuICAgIGNvbnN0IHRvcCA9IHBpY2tlclNpemUgLyAyIC0gKDIgKiB0cmlhbmdsZUhlaWdodCkgLyAzXG5cbiAgICAvLyB0cmlhbmdsZSByZWxhdGl2ZSBjb29yZGluYXRlc1xuICAgIGNvbnN0IG1hcmdpbkxlZnQgPSAodGhpcy5fbGF5b3V0LndpZHRoIC0gdGhpcy5zdGF0ZS5waWNrZXJTaXplKSAvIDJcbiAgICBjb25zdCBtYXJnaW5Ub3AgPSAodGhpcy5fbGF5b3V0LmhlaWdodCAtIHRoaXMuc3RhdGUucGlja2VyU2l6ZSkgLyAyXG4gICAgY29uc3QgcmVsYXRpdmVYID0geCAtIHRoaXMuX3BhZ2VYIC0gbWFyZ2luTGVmdCAtIGxlZnRcbiAgICBjb25zdCByZWxhdGl2ZVkgPSB5IC0gdGhpcy5fcGFnZVkgLSBtYXJnaW5Ub3AgLSB0b3BcblxuICAgIC8vIHJvdGF0aW9uXG4gICAgY29uc3QgeyBoIH0gPSB0aGlzLl9nZXRDb2xvcigpXG4gICAgY29uc3QgZGVnID0gKGggLSAzMzAgKyAzNjApICUgMzYwIC8vIHN0YXJ0aW5nIGFuZ2xlIGlzIDMzMCBkdWUgdG8gY29tZm9ydGFibGUgY2FsY3VsYXRpb25cbiAgICBjb25zdCByYWQgPSAoZGVnICogTWF0aC5QSSkgLyAxODBcbiAgICBjb25zdCBjZW50ZXIgPSB7XG4gICAgICB4OiB0cmlhbmdsZVdpZHRoIC8gMixcbiAgICAgIHk6ICgyICogdHJpYW5nbGVIZWlnaHQpIC8gMyxcbiAgICB9XG4gICAgY29uc3Qgcm90YXRlZCA9IHJvdGF0ZVBvaW50KHsgeDogcmVsYXRpdmVYLCB5OiByZWxhdGl2ZVkgfSwgcmFkLCBjZW50ZXIpXG5cbiAgICBjb25zdCBsaW5lID0gKHRyaWFuZ2xlV2lkdGggKiByb3RhdGVkLnkpIC8gdHJpYW5nbGVIZWlnaHRcbiAgICBjb25zdCBtYXJnaW4gPVxuICAgICAgdHJpYW5nbGVXaWR0aCAvIDIgLSAoKHRyaWFuZ2xlV2lkdGggLyAyKSAqIHJvdGF0ZWQueSkgLyB0cmlhbmdsZUhlaWdodFxuICAgIGNvbnN0IHMgPSAocm90YXRlZC54IC0gbWFyZ2luKSAvIGxpbmVcbiAgICBjb25zdCB2ID0gcm90YXRlZC55IC8gdHJpYW5nbGVIZWlnaHRcblxuICAgIC8vIG5vcm1hbGl6ZVxuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSB0aGlzLl9ub3JtYWxpemVUcmlhbmdsZVRvdWNoKFxuICAgICAgcyxcbiAgICAgIHYsXG4gICAgICBsaW5lIC8gdHJpYW5nbGVIZWlnaHRcbiAgICApXG5cbiAgICByZXR1cm4geyBoLCBzOiBub3JtYWxpemVkLnMsIHY6IG5vcm1hbGl6ZWQudiB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBwaWNrZXJTaXplIH0gPSB0aGlzLnN0YXRlXG4gICAgY29uc3QgeyBvbGRDb2xvciwgc3R5bGUgfSA9IHRoaXMucHJvcHNcbiAgICBjb25zdCBjb2xvciA9IHRoaXMuX2dldENvbG9yKClcbiAgICBjb25zdCB7IGggfSA9IGNvbG9yXG4gICAgY29uc3QgYW5nbGUgPSB0aGlzLl9oVmFsdWVUb1JhZChoKVxuICAgIGNvbnN0IHNlbGVjdGVkQ29sb3IgPSB0aW55Y29sb3IoY29sb3IpLnRvSGV4U3RyaW5nKClcbiAgICBjb25zdCBpbmRpY2F0b3JDb2xvciA9IHRpbnljb2xvcih7IGgsIHM6IDEsIHY6IDEgfSkudG9IZXhTdHJpbmcoKVxuICAgIGNvbnN0IGNvbXB1dGVkID0gbWFrZUNvbXB1dGVkU3R5bGVzKHtcbiAgICAgIHBpY2tlclNpemUsXG4gICAgICBzZWxlY3RlZENvbG9ySHN2OiBjb2xvcixcbiAgICAgIGluZGljYXRvckNvbG9yLFxuICAgICAgYW5nbGUsXG4gICAgICBpc1JUTDogdGhpcy5faXNSVEwsXG4gICAgfSlcbiAgICAvLyBIYWNrIGZvciBodHRwczovL2dpdGh1Yi5jb20vaW5zdGVhL3JlYWN0LW5hdGl2ZS1jb2xvci1waWNrZXIvaXNzdWVzLzE3XG4gICAgY29uc3Qgcm90YXRpb25IYWNrID0gbWFrZVJvdGF0aW9uS2V5KHRoaXMucHJvcHMsIGFuZ2xlKVxuICAgIHJldHVybiAoXG4gICAgICA8VmlldyBzdHlsZT17c3R5bGV9PlxuICAgICAgICA8Vmlld1xuICAgICAgICAgIG9uTGF5b3V0PXt0aGlzLl9vbkxheW91dH1cbiAgICAgICAgICByZWY9XCJwaWNrZXJDb250YWluZXJcIlxuICAgICAgICAgIHN0eWxlPXtzdHlsZXMucGlja2VyQ29udGFpbmVyfVxuICAgICAgICA+XG4gICAgICAgICAgeyFwaWNrZXJTaXplID8gbnVsbCA6IChcbiAgICAgICAgICAgIDxWaWV3PlxuICAgICAgICAgICAgICA8Vmlld1xuICAgICAgICAgICAgICAgIGtleT17cm90YXRpb25IYWNrfVxuICAgICAgICAgICAgICAgIHN0eWxlPXtbc3R5bGVzLnRyaWFuZ2xlQ29udGFpbmVyLCBjb21wdXRlZC50cmlhbmdsZUNvbnRhaW5lcl19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8Vmlld1xuICAgICAgICAgICAgICAgICAgc3R5bGU9e1tcbiAgICAgICAgICAgICAgICAgICAgc3R5bGVzLnRyaWFuZ2xlVW5kZXJsYXlpbmdDb2xvcixcbiAgICAgICAgICAgICAgICAgICAgY29tcHV0ZWQudHJpYW5nbGVVbmRlcmxheWluZ0NvbG9yLFxuICAgICAgICAgICAgICAgICAgXX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxJbWFnZVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e1tjb21wdXRlZC50cmlhbmdsZUltYWdlXX1cbiAgICAgICAgICAgICAgICAgIHNvdXJjZT17cmVxdWlyZShcIi4uL3Jlc291cmNlcy9oc3ZfdHJpYW5nbGVfbWFzay5wbmdcIil9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgICAgICA8Vmlld1xuICAgICAgICAgICAgICAgIHsuLi50aGlzLl9waWNrZXJSZXNwb25kZXIucGFuSGFuZGxlcnN9XG4gICAgICAgICAgICAgICAgc3R5bGU9e1tjb21wdXRlZC5waWNrZXJdfVxuICAgICAgICAgICAgICAgIGNvbGxhcHNhYmxlPXtmYWxzZX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxJbWFnZVxuICAgICAgICAgICAgICAgICAgc291cmNlPXtyZXF1aXJlKFwiLi4vcmVzb3VyY2VzL2NvbG9yLWNpcmNsZS5wbmdcIil9XG4gICAgICAgICAgICAgICAgICByZXNpemVNb2RlPVwiY29udGFpblwiXG4gICAgICAgICAgICAgICAgICBzdHlsZT17W3N0eWxlcy5waWNrZXJJbWFnZV19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8Vmlld1xuICAgICAgICAgICAgICAgICAga2V5PXtyb3RhdGlvbkhhY2t9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17W3N0eWxlcy5waWNrZXJJbmRpY2F0b3IsIGNvbXB1dGVkLnBpY2tlckluZGljYXRvcl19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPFZpZXdcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e1tcbiAgICAgICAgICAgICAgICAgICAgICBzdHlsZXMucGlja2VySW5kaWNhdG9yVGljayxcbiAgICAgICAgICAgICAgICAgICAgICBjb21wdXRlZC5waWNrZXJJbmRpY2F0b3JUaWNrLFxuICAgICAgICAgICAgICAgICAgICBdfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgICAgICAgICAgPFZpZXcgc3R5bGU9e1tzdHlsZXMuc3ZJbmRpY2F0b3IsIGNvbXB1dGVkLnN2SW5kaWNhdG9yXX0gLz5cbiAgICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvVmlldz5cbiAgICAgICAge3RoaXMucHJvcHMuaGlkZUNvbnRyb2xzID09IHRydWUgPyBudWxsIDogKFxuICAgICAgICAgIDxWaWV3IHN0eWxlPXtbc3R5bGVzLmNvbG9yUHJldmlld3MsIGNvbXB1dGVkLmNvbG9yUHJldmlld3NdfT5cbiAgICAgICAgICAgIHtvbGRDb2xvciAmJiAoXG4gICAgICAgICAgICAgIDxUb3VjaGFibGVPcGFjaXR5XG4gICAgICAgICAgICAgICAgc3R5bGU9e1tzdHlsZXMuY29sb3JQcmV2aWV3LCB7IGJhY2tncm91bmRDb2xvcjogb2xkQ29sb3IgfV19XG4gICAgICAgICAgICAgICAgb25QcmVzcz17dGhpcy5fb25PbGRDb2xvclNlbGVjdGVkfVxuICAgICAgICAgICAgICAgIGFjdGl2ZU9wYWNpdHk9ezAuN31cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8VG91Y2hhYmxlT3BhY2l0eVxuICAgICAgICAgICAgICBzdHlsZT17W3N0eWxlcy5jb2xvclByZXZpZXcsIHsgYmFja2dyb3VuZENvbG9yOiBzZWxlY3RlZENvbG9yIH1dfVxuICAgICAgICAgICAgICBvblByZXNzPXt0aGlzLl9vbkNvbG9yU2VsZWN0ZWR9XG4gICAgICAgICAgICAgIGFjdGl2ZU9wYWNpdHk9ezAuN31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9WaWV3PlxuICAgICAgICApfVxuICAgICAgPC9WaWV3PlxuICAgIClcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRQaWNrZXJQcm9wZXJ0aWVzKHBpY2tlclNpemUpIHtcbiAgY29uc3QgaW5kaWNhdG9yUGlja2VyUmF0aW8gPSA0MiAvIDUxMCAvLyBjb21wdXRlZCBmcm9tIHBpY2tlciBpbWFnZVxuICBjb25zdCBvcmlnaW5hbEluZGljYXRvclNpemUgPSBpbmRpY2F0b3JQaWNrZXJSYXRpbyAqIHBpY2tlclNpemVcbiAgY29uc3QgaW5kaWNhdG9yU2l6ZSA9IG9yaWdpbmFsSW5kaWNhdG9yU2l6ZVxuICBjb25zdCBwaWNrZXJQYWRkaW5nID0gb3JpZ2luYWxJbmRpY2F0b3JTaXplIC8gM1xuXG4gIGNvbnN0IHRyaWFuZ2xlU2l6ZSA9IHBpY2tlclNpemUgLSA2ICogcGlja2VyUGFkZGluZ1xuICBjb25zdCB0cmlhbmdsZVJhZGl1cyA9IHRyaWFuZ2xlU2l6ZSAvIDJcbiAgY29uc3QgdHJpYW5nbGVIZWlnaHQgPSAodHJpYW5nbGVSYWRpdXMgKiAzKSAvIDJcbiAgY29uc3QgdHJpYW5nbGVXaWR0aCA9IDIgKiB0cmlhbmdsZVJhZGl1cyAqIE1hdGguc3FydCgzIC8gNCkgLy8gcHl0aGFnb3JlYW4gdGhlb3JlbVxuXG4gIHJldHVybiB7XG4gICAgdHJpYW5nbGVTaXplLFxuICAgIHRyaWFuZ2xlUmFkaXVzLFxuICAgIHRyaWFuZ2xlSGVpZ2h0LFxuICAgIHRyaWFuZ2xlV2lkdGgsXG4gICAgaW5kaWNhdG9yUGlja2VyUmF0aW8sXG4gICAgaW5kaWNhdG9yU2l6ZSxcbiAgICBwaWNrZXJQYWRkaW5nLFxuICB9XG59XG5cbmNvbnN0IG1ha2VDb21wdXRlZFN0eWxlcyA9ICh7XG4gIGluZGljYXRvckNvbG9yLFxuICBhbmdsZSxcbiAgcGlja2VyU2l6ZSxcbiAgc2VsZWN0ZWRDb2xvckhzdixcbiAgaXNSVEwsXG59KSA9PiB7XG4gIGNvbnN0IHtcbiAgICB0cmlhbmdsZVNpemUsXG4gICAgdHJpYW5nbGVIZWlnaHQsXG4gICAgdHJpYW5nbGVXaWR0aCxcbiAgICBpbmRpY2F0b3JTaXplLFxuICAgIHBpY2tlclBhZGRpbmcsXG4gIH0gPSBnZXRQaWNrZXJQcm9wZXJ0aWVzKHBpY2tlclNpemUpXG5cbiAgLyogPT09PT0gSU5ESUNBVE9SID09PT09ICovXG4gIGNvbnN0IGluZGljYXRvclJhZGl1cyA9IHBpY2tlclNpemUgLyAyIC0gaW5kaWNhdG9yU2l6ZSAvIDIgLSBwaWNrZXJQYWRkaW5nXG4gIGNvbnN0IG14ID0gcGlja2VyU2l6ZSAvIDJcbiAgY29uc3QgbXkgPSBwaWNrZXJTaXplIC8gMlxuICBjb25zdCBkeCA9IE1hdGguY29zKGFuZ2xlKSAqIGluZGljYXRvclJhZGl1c1xuICBjb25zdCBkeSA9IE1hdGguc2luKGFuZ2xlKSAqIGluZGljYXRvclJhZGl1c1xuXG4gIC8qID09PT09IFRSSUFOR0xFID09PT09ICovXG4gIGNvbnN0IHRyaWFuZ2xlVG9wID0gcGlja2VyUGFkZGluZyAqIDNcbiAgY29uc3QgdHJpYW5nbGVMZWZ0ID0gcGlja2VyUGFkZGluZyAqIDNcbiAgY29uc3QgdHJpYW5nbGVBbmdsZSA9IC1hbmdsZSArIE1hdGguUEkgLyAzXG5cbiAgLyogPT09PT0gU1YgSU5ESUNBVE9SID09PT09ICovXG4gIGNvbnN0IG1hcmtlckNvbG9yID0gXCJyZ2JhKDAsMCwwLDAuOClcIlxuICBjb25zdCB7IHMsIHYsIGggfSA9IHNlbGVjdGVkQ29sb3JIc3ZcbiAgY29uc3Qgc3ZJbmRpY2F0b3JTaXplID0gMThcbiAgY29uc3Qgc3ZZID0gdiAqIHRyaWFuZ2xlSGVpZ2h0XG4gIGNvbnN0IG1hcmdpbiA9IHRyaWFuZ2xlV2lkdGggLyAyIC0gdiAqICh0cmlhbmdsZVdpZHRoIC8gMilcbiAgY29uc3Qgc3ZYID0gcyAqICh0cmlhbmdsZVdpZHRoIC0gMiAqIG1hcmdpbikgKyBtYXJnaW5cbiAgY29uc3Qgc3ZJbmRpY2F0b3JNYXJnaW5MZWZ0ID0gKHBpY2tlclNpemUgLSB0cmlhbmdsZVdpZHRoKSAvIDJcbiAgY29uc3Qgc3ZJbmRpY2F0b3JNYXJnaW5Ub3AgPSAocGlja2VyU2l6ZSAtICg0ICogdHJpYW5nbGVIZWlnaHQpIC8gMykgLyAyXG5cbiAgY29uc3QgZGVnID0gKGggLSAzMzAgKyAzNjApICUgMzYwIC8vIHN0YXJ0aW5nIGFuZ2xlIGlzIDMzMCBkdWUgdG8gY29tZm9ydGFibGUgY2FsY3VsYXRpb25cbiAgY29uc3QgcmFkID0gKGRlZyAqIE1hdGguUEkpIC8gMTgwXG4gIGNvbnN0IGNlbnRlciA9IHsgeDogcGlja2VyU2l6ZSAvIDIsIHk6IHBpY2tlclNpemUgLyAyIH1cbiAgY29uc3Qgbm90Um90YXRlZFBvaW50ID0ge1xuICAgIHg6IHN2SW5kaWNhdG9yTWFyZ2luVG9wICsgc3ZZLFxuICAgIHk6IHN2SW5kaWNhdG9yTWFyZ2luTGVmdCArIHN2WCxcbiAgfVxuICBjb25zdCBzdkluZGljYXRvclBvaW50ID0gcm90YXRlUG9pbnQobm90Um90YXRlZFBvaW50LCByYWQsIGNlbnRlcilcblxuICByZXR1cm4ge1xuICAgIHBpY2tlcjoge1xuICAgICAgcGFkZGluZzogcGlja2VyUGFkZGluZyxcbiAgICAgIHdpZHRoOiBwaWNrZXJTaXplLFxuICAgICAgaGVpZ2h0OiBwaWNrZXJTaXplLFxuICAgIH0sXG4gICAgcGlja2VySW5kaWNhdG9yOiB7XG4gICAgICB0b3A6IG14ICsgZHggLSBpbmRpY2F0b3JTaXplIC8gMixcbiAgICAgIFtpc1JUTCA/IFwicmlnaHRcIiA6IFwibGVmdFwiXTogbXkgKyBkeSAtIGluZGljYXRvclNpemUgLyAyLFxuICAgICAgd2lkdGg6IGluZGljYXRvclNpemUsXG4gICAgICBoZWlnaHQ6IGluZGljYXRvclNpemUsXG4gICAgICB0cmFuc2Zvcm06IFtcbiAgICAgICAge1xuICAgICAgICAgIHJvdGF0ZTogLWFuZ2xlICsgXCJyYWRcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBwaWNrZXJJbmRpY2F0b3JUaWNrOiB7XG4gICAgICBoZWlnaHQ6IGluZGljYXRvclNpemUgLyAyLFxuICAgICAgYmFja2dyb3VuZENvbG9yOiBtYXJrZXJDb2xvcixcbiAgICB9LFxuICAgIHN2SW5kaWNhdG9yOiB7XG4gICAgICB0b3A6IHN2SW5kaWNhdG9yUG9pbnQueCAtIHN2SW5kaWNhdG9yU2l6ZSAvIDIsXG4gICAgICBbaXNSVEwgPyBcInJpZ2h0XCIgOiBcImxlZnRcIl06IHN2SW5kaWNhdG9yUG9pbnQueSAtIHN2SW5kaWNhdG9yU2l6ZSAvIDIsXG4gICAgICB3aWR0aDogc3ZJbmRpY2F0b3JTaXplLFxuICAgICAgaGVpZ2h0OiBzdkluZGljYXRvclNpemUsXG4gICAgICBib3JkZXJSYWRpdXM6IHN2SW5kaWNhdG9yU2l6ZSAvIDIsXG4gICAgICBib3JkZXJDb2xvcjogbWFya2VyQ29sb3IsXG4gICAgfSxcbiAgICB0cmlhbmdsZUNvbnRhaW5lcjoge1xuICAgICAgd2lkdGg6IHRyaWFuZ2xlU2l6ZSxcbiAgICAgIGhlaWdodDogdHJpYW5nbGVTaXplLFxuICAgICAgdHJhbnNmb3JtOiBbXG4gICAgICAgIHtcbiAgICAgICAgICByb3RhdGU6IHRyaWFuZ2xlQW5nbGUgKyBcInJhZFwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIHRvcDogdHJpYW5nbGVUb3AsXG4gICAgICBsZWZ0OiB0cmlhbmdsZUxlZnQsXG4gICAgfSxcbiAgICB0cmlhbmdsZUltYWdlOiB7XG4gICAgICB3aWR0aDogdHJpYW5nbGVXaWR0aCxcbiAgICAgIGhlaWdodDogdHJpYW5nbGVIZWlnaHQsXG4gICAgfSxcbiAgICB0cmlhbmdsZVVuZGVybGF5aW5nQ29sb3I6IHtcbiAgICAgIGxlZnQ6ICh0cmlhbmdsZVNpemUgLSB0cmlhbmdsZVdpZHRoKSAvIDIsXG4gICAgICBib3JkZXJMZWZ0V2lkdGg6IHRyaWFuZ2xlV2lkdGggLyAyLFxuICAgICAgYm9yZGVyUmlnaHRXaWR0aDogdHJpYW5nbGVXaWR0aCAvIDIsXG4gICAgICBib3JkZXJCb3R0b21XaWR0aDogdHJpYW5nbGVIZWlnaHQsXG4gICAgICBib3JkZXJCb3R0b21Db2xvcjogaW5kaWNhdG9yQ29sb3IsXG4gICAgfSxcbiAgICBjb2xvclByZXZpZXdzOiB7XG4gICAgICBoZWlnaHQ6IHBpY2tlclNpemUgKiAwLjEsIC8vIHJlc3BvbnNpdmUgaGVpZ2h0XG4gICAgfSxcbiAgfVxufVxuXG5jb25zdCBzdHlsZXMgPSBTdHlsZVNoZWV0LmNyZWF0ZSh7XG4gIHBpY2tlckNvbnRhaW5lcjoge1xuICAgIGZsZXg6IDEsXG4gICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcbiAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcbiAgfSxcbiAgcGlja2VySW1hZ2U6IHtcbiAgICBmbGV4OiAxLFxuICAgIHdpZHRoOiBudWxsLFxuICAgIGhlaWdodDogbnVsbCxcbiAgfSxcbiAgcGlja2VySW5kaWNhdG9yOiB7XG4gICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIixcbiAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxuICAgIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxuICB9LFxuICB0cmlhbmdsZUNvbnRhaW5lcjoge1xuICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcbiAgfSxcbiAgdHJpYW5nbGVVbmRlcmxheWluZ0NvbG9yOiB7XG4gICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIixcbiAgICB0b3A6IDAsXG4gICAgd2lkdGg6IDAsXG4gICAgaGVpZ2h0OiAwLFxuICAgIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiLFxuICAgIGJvcmRlclN0eWxlOiBcInNvbGlkXCIsXG4gICAgYm9yZGVyTGVmdENvbG9yOiBcInRyYW5zcGFyZW50XCIsXG4gICAgYm9yZGVyUmlnaHRDb2xvcjogXCJ0cmFuc3BhcmVudFwiLFxuICB9LFxuICBwaWNrZXJBbGlnbm1lbnQ6IHtcbiAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxuICB9LFxuICBzdkluZGljYXRvcjoge1xuICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gICAgYm9yZGVyV2lkdGg6IDQsXG4gIH0sXG4gIHBpY2tlckluZGljYXRvclRpY2s6IHtcbiAgICB3aWR0aDogNSxcbiAgfSxcbiAgY29sb3JQcmV2aWV3czoge1xuICAgIGZsZXhEaXJlY3Rpb246IFwicm93XCIsXG4gIH0sXG4gIGNvbG9yUHJldmlldzoge1xuICAgIGZsZXg6IDEsXG4gIH0sXG59KVxuIl19