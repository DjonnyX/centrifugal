import { TextDirections } from "../enums/text-directions";

/**
 * TextDirection
 * 'rtl' - right-to-left.
 * 'ltr' - left-to-right.
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/text-direction.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export type TextDirection = TextDirections | 'rtl' | 'ltr';
