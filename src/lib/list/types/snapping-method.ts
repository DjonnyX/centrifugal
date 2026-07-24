import { SnappingMethods } from "../enums/snapping-methods";

/**
 * Snapping method.
 * 'standart' - Classic group visualization.
 * 'advanced' - A mask is applied to the viewport area so that the background is displayed underneath the attached group.
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/enums/snapping-method.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export type SnappingMethod = SnappingMethods | 'standart' | 'advanced';