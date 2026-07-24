import { CollapsingModes } from "../enums/collapsing-modes";

/**
 * Modes for collapsing list items.
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/enums/collapsing-mode.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export type CollapsingMode = CollapsingModes | 'none' | 'multi-collapse' | 'accordion';
