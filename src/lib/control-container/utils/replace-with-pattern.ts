/**
 * replaceWithPattern
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/utils/replace-with-pattern.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const replaceWithPattern = (pattern: RegExp | null, src: string) => {
    if (!pattern) {
        return src;
    }
    let result = '';
    for (const char of src) {
        if (pattern.test(char)) {
            result += char;
        }
    }
    return result;
}
