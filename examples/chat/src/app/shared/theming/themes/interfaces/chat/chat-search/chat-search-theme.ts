/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
interface IChatSearchStateTheme {
    background?: string;
    borderColor?: string;
    color?: string;
    fill?: string;
    fontSize?: string;
    placeholder?: {
        fontSize?: string;
        color?: string;
    },
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IChatSearchTheme {
    normal: IChatSearchStateTheme;
    focused: IChatSearchStateTheme;
}
