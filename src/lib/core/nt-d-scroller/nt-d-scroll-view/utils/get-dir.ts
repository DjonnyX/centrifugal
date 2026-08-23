/**
 * getDir
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/core/nt-d-scroller/nt-d-scroll-view/utils/get-dir.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const getDir = (p: number, c: number) => {
    return p < c ? 1 : p > c ? -1 : 0;
}