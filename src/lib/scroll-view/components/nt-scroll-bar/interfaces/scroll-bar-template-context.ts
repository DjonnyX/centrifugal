import { GradientColorPositions } from "../../../../common";
import { NtScrollBarPublicService } from "../nt-scroll-bar-public.service";

export interface IScrollBarTemplateContext {
    /**
     * API provider
     */
    api: NtScrollBarPublicService;
    /**
     * Scrollbar thumb width.
     */
    width: number;
    /**
     * Scrollbar thumb height.
     */
    height: number;
    /**
     * Gradient fill position parameters.
     */
    fillPositions: GradientColorPositions;
    /**
     * Additional options for the scrollbar.
     */
    params: { [propName: string]: any };
}
