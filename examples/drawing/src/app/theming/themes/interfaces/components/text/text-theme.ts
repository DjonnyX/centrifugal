/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface ITextTheme {
    fontSize: number | string;
    color: string;
    textAlign: 'left' | 'right' | 'center';
    fontWeight: 'normal' | 'bold' | 'bolder';
    textTransform: 'lowercase' | 'uppercase' | 'none';
}