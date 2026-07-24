/**
 * IAnimationParams
 * Maximum performance for extremely large lists.
 * It is based on algorithms for virtualization of screen objects.
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/interfaces/animation-params.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IAnimationParams {
    scrollToItem: number;
    snapToItem: number;
    navigateToItem: number;
    navigateByKeyboard: number;
}
