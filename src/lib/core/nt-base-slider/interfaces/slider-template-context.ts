import { GradientColorPositions } from "../../../common";
import { NtBaseSliderPublicService } from "../nt-base-slider-public.service";

/**
 * ISliderTemplateContext
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/core/nt-base-slider/interfaces/slider-template-context.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface ISliderTemplateContext {
    /**
     * API provider
     */
    api: NtBaseSliderPublicService;
    /**
     * Slider thumb width.
     */
    width: number;
    /**
     * Slider thumb height.
     */
    height: number;
    /**
     * Gradient fill position parameters.
     */
    fillPositions: GradientColorPositions;
    /**
     * Additional options for the Slider.
     */
    params: { [propName: string]: any };
}
