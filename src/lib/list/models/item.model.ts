/**
 * Virtual list element model
 * For tracking to work correctly, you must set a unique identifier (the property specified by trackBy).
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/models/item.model.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export type IVirtualListItem<E = Object> = E & {
    /**
     * The type of the collection item. Items with different types are cached in separate pools.
     */
    type?: string | symbol;
    /**
     * Props.
     */
    [x: string]: any;
};
