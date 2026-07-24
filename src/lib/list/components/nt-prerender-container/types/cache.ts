import { Id, ISize } from "../../../../common";

/**
 * PrerenderCache
 * Maximum performance for extremely large lists.
 * It is based on algorithms for virtualization of screen objects.
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/prerender-container/types/cache.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export type PrerenderCache = { [id: Id]: ISize };
