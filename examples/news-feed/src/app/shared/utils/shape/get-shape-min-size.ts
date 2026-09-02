import { RoundedCorner } from "../../types";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export const getShapeMinSize = (roundedRectPath: RoundedCorner) => {
    if (!Array.isArray(roundedRectPath)) {
        return 0;
    }
    return Math.max(...roundedRectPath) * 2;
};
