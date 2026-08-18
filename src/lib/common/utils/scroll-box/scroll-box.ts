import { Directions } from "../../enums";
import { GradientColorPositions } from "../../types";
import { ICalculateScrollParams, ICalculateScrollPositionParams, ICalculateScrollMetrics } from "./interfaces";

/**
 * ScrollBox
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/components/scroller/utils/scroll-box.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export class ScrollBox {
    calculateScroll({
        direction,
        viewportWidth,
        viewportHeight,
        contentWidth,
        contentHeight,
        startOffset,
        endOffset,
        positionX,
        positionY,
        minSize,
    }: ICalculateScrollParams) {
        const isVertical = direction === Directions.VERTICAL;
        let x = 0, y = 0, thumbPosition = 0, thumbSize = 0, thumbGradientPositions: GradientColorPositions = [0, 0];
        if (isVertical) {
            const { gradientPos, size, pos, } = this.getMetrics(positionY, viewportHeight, contentHeight, startOffset, endOffset, minSize);
            thumbGradientPositions = gradientPos;
            thumbSize = size;
            thumbPosition = pos;
        } else {
            const { gradientPos, size, pos, } = this.getMetrics(positionX, viewportWidth, contentWidth, startOffset, endOffset, minSize);
            thumbGradientPositions = gradientPos;
            thumbSize = size;
            thumbPosition = pos;
        }
        return {
            x,
            y,
            thumbSize,
            thumbPosition,
            thumbGradientPositions,
        };
    }

    private getMetrics(inputPosition: number, viewportSize: number, contentSize: number, startOffset: number, endOffset: number,
        minSize: number): ICalculateScrollMetrics {
        let thumbPosition = 0, thumbSize = 0;
        const vh = viewportSize - startOffset - endOffset, ch = contentSize - startOffset - endOffset,
            ratio = ch > 0 ? vh / ch : 1, ts = vh * ratio, ats = Math.max(ts, minSize), atsDelta = ats - ts,
            rh = (ch !== 0 ? (inputPosition / ch) : 0),
            pos = startOffset + ((vh - atsDelta) * rh),
            size = ats, asp = pos, bRatio = size !== 0 ? vh / size : 0,
            aspp = -(vh !== 0 ? asp / vh : 0) * bRatio, aep = vh - (aspp + size),
            aepp = (aspp + (vh !== 0 ? (aep + size) / vh : 0) * bRatio);
        thumbSize = ats;
        thumbPosition = pos;
        return {
            gradientPos: [aspp, aepp],
            size,
            pos,
        };
    }

    getScrollPositionByScrollBar({
        scrollSize,
        position,
    }: ICalculateScrollPositionParams) {
        const pos = (position * scrollSize);
        return {
            position: pos,
        };
    }
}