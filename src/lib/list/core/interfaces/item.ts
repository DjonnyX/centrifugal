/**
 * IItem
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/core/interfaces/item.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IItem<I = any> {
    [prop: string]: I;
}