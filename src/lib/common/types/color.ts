/**
 * Color
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/color.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export type Color = `#${string}` | `rgb(${number},${number},${number})` | `rgba(${number},${number},${number},${number})`
    | `rgba(#${string},${number})`;
