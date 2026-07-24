import { OnChangeEventListener } from "./on-change-event-listener";
import { OnTickEventListener } from "./on-tick-event-listener";

/**
 * CacheMapListeners
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/core/types/cache-map-listeners.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export type CacheMapListeners = OnChangeEventListener | OnTickEventListener;
