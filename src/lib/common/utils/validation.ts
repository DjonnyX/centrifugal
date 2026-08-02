const isUndefinable = <T = any>(value: T) => {
    return value === undefined;
}

const isNullable = <T = any>(value: T) => {
    return value === null;
}

/**
 * Int validator
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/utils/validation.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @param value Int
 */
export const validateInt = (value: number | undefined, undefinable = false) => {
    return (undefinable && isUndefinable(value)) || !Number.isNaN(Number.parseInt(`${value}`));
};

/**
 * Float validator
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/utils/validation.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @param value Float
 */
export const validateFloat = (value: number | undefined, undefinable = false) => {
    return (undefinable && isUndefinable(value)) || !Number.isNaN(Number.parseFloat(`${value}`));
};

/**
 * String validator
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/utils/validation.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @param value String
 */
export const validateString = (value: string | undefined | null, undefinable = false, nullable = false) => {
    return (undefinable && isUndefinable(value)) || (nullable && isNullable(value)) || typeof value === 'string';
};

/**
 * Boolean validator
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/utils/validation.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @param value Boolean
 */
export const validateBoolean = (value: boolean | undefined, undefinable = false) => {
    return (undefinable && isUndefinable(value)) || typeof value === 'boolean';
};

/**
 * Array validator
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/utils/validation.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @param value Array
 */
export const validateArray = <T = any>(value: Array<T> | undefined | null, undefinable = false, nullable = false) => {
    return (undefinable && isUndefinable(value)) || (nullable && isNullable(value)) || value instanceof Array;
};

/**
 * Object validator
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/utils/validation.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @param value Object
 */
export const validateObject = <T = any>(value: Object & T | undefined | null, undefinable = false, nullable = false) => {
    return (undefinable && isUndefinable(value)) || (nullable && isNullable(value)) || typeof value === 'object';
};

/**
 * Function validator
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/utils/validation.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @param value Function
 */
export const validateFunction = <T = any>(value: Object & T | undefined | null, undefinable = false, nullable = false) => {
    return (undefinable && isUndefinable(value)) || (nullable && isNullable(value)) || typeof value === 'function';
};
