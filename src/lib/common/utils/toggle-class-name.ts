/**
 * Switch css classes
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/utils/toggle-class-name.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const toggleClassName = (el: HTMLElement, className: string, removeClassNames?: Array<string>) => {
    if (!el.classList.contains(className)) {
        el.classList.add(className);
    }
    if (!!removeClassNames) {
        removeClassNames.forEach(v => {
            el.classList.remove(v);
        });
    }
};
