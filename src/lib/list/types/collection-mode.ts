import { CollectionModes } from "../enums/collection-modes";

/**
 * Action modes for collection elements.
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/enums/collection-mode.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export type CollectionMode = CollectionModes | 'normal' | 'lazy';
