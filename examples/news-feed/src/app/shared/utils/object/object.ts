/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export const objectAsReadonly = <T = { [x: string]: any }>(source: T) => {
    if (!source) {
        return source;
    }

    const result = {} as T;
    for (const prop in source) {
        const value = source[prop];
        Object.defineProperty(result, prop, {
            value,
            writable: false,
            enumerable: true,
        });
    }

    return result;
};
