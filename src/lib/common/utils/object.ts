/**
 * objectAsReadonly
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/utils/object.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
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

/**
 * copyValueAsReadonly
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/utils/object.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const copyValueAsReadonly = <T = any>(source: T) => {
    if (!source) {
        return source;
    }

    if (source instanceof Array) {
        return Object.freeze([...source]) as T;
    }

    if (typeof source === 'object') {
        return objectAsReadonly(source);
    }

    return source;
}