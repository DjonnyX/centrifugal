/**
 * ITabsTemplateContext
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/tabs/interfaces/tabs-template-context.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface ITabsTemplateContext {
    /**
     * Slider thumb width.
     */
    width: number;
    /**
     * Slider thumb height.
     */
    height: number;
    /**
     * Additional options for the Slider.
     */
    params: { [propName: string]: any };
}
