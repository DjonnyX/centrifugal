import { IScrollToParams } from "./scroll-to-params";

/**
 * IListScrollToParams
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/scroll-to-params.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IListScrollToParams extends IScrollToParams {
    snap?: boolean;
}
