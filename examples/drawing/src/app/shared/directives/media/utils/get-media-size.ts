import { ISize } from 'ng-virtual-list';
import { IMediaParams } from "../interfaces";
import { MediaScreenSize } from "../types";

const COLL_PATTERN = /^(col-[\d]+)$/,
    MAX_COLUMNS = 12,
    COL = 'col-';

export const getMediaSize = (mediaSize: IMediaParams | undefined, bounds: ISize | undefined, size: MediaScreenSize | undefined) => {
    if (size && mediaSize && bounds) {
        const mSize = mediaSize[size];
        if (mSize === undefined) {
            return undefined;
        }
        else if (typeof mSize === 'number') {
            return mSize as number;
        } else if (COLL_PATTERN.test(mSize)) {
            const s = Number(mSize.replace(COL, ''));
            if (!Number.isNaN(s)) {
                return (bounds.width * s) / MAX_COLUMNS;
            }
        } else {
            return mSize as string;
        }
    }
    return undefined;
}