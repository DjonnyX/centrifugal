/**
 * Snapping method.
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/types/snapping-method.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export enum SnappingMethods {
    /**
     * The group is rendered on a background.
     */
    STANDART = 'standart',
    /**
     * A mask is applied to the viewport area so that the background is displayed underneath the attached group.
     */
    ADVANCED = 'advanced',
}