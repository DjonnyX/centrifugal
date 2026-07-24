import { IRect } from "../../common";

/**
 * Display object metrics.
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/models/display-object-measures.model.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IDisplayObjectMeasures extends IRect {
  /**
   * Item position
   */
  position: number;
  /**
   * Scroll size
   */
  scrollSize: number;
  /**
   * Item size
   */
  size: number;
  /**
   * Bounds size
   */
  boundsSize: number;
  /**
   * Start position in viewport
   */
  absoluteStartPosition: number;
  /**
   * Start position in viewport (percent)
   */
  absoluteStartPositionPercent: number;
  /**
   * End position in viewport
   */
  absoluteEndPosition: number;
  /**
   * End position in viewport (percent)
   */
  absoluteEndPositionPercent: number;
  /**
   * Delta is calculated for Snapping Method.ADVANCED
   */
  delta: number;
}