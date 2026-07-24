import { ISize } from "../../../common";
import { ItemDisplayMethods } from "../enums";
import { IItem } from "../interfaces";

/**
 * Cache
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/core/types/cache.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export type Cache = ISize & { method?: ItemDisplayMethods } & IItem;
