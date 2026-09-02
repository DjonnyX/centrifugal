import { IFileViewerLocalization } from "./file-viewer-localization";
import { ICommonLocalization } from "./common-localization";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface ILocalization {
    fileViewer: IFileViewerLocalization;
    common: ICommonLocalization;
}