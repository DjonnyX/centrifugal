# Centrifugal

## [NtSliderComponent](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/slider/nt-slider.component.ts)

Inputs

| Property | Type | Description |
|---|---|---|
| direction | [SDirection](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/core/nt-s-scroller/types/s-direction.ts) = "horizontal" | Determines the slider direction. Default value is "horizontal". |
| overscrollEnabled | boolean = false | Determines whether the overscroll (re-scroll) feature will work. The default value is "false". |
| value | number = 0 | Slider value. Default value is `0`. |
| min | number = 0 | Slider min value. Default min value is `0`. |
| max | number | Slider max value. Required. |
| step | number = 0 | Step. Default value is `0`. |
| interactive | boolean = true | Determines whether the slider will respond to user interaction or not. The default value is `true`. |
| scrollStartOffset | [ArithmeticExpression](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/arithmetic-expression.ts) = 0 | Sets the scroll start offset value. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". |
| scrollEndOffset | [ArithmeticExpression](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/arithmetic-expression.ts) = 0 | Sets the scroll end offset value. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". |
| behavior | ScrollBehavior = 'smooth' | Defines the scrolling behavior for any element on the page. The default value is "smooth". |
| motionBlur | number = 2 | Motion blur effect. The default value is `2`. |
| maxMotionBlur | number = 5 | Maximum motion blur effect. The default value is `5`. |
| motionBlurEnabled | boolean = false | Determines whether to apply motion blur or not. The default value is `false`. |
| scrollingSettings | [IScrollingSettings](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/scrolling-settings.ts) = { frictionalForce: 0.035, mass: 0.005, maxDistance: 100000, maxDuration: 4000, speedScale: 10, breakpointStoppingFactor: 10, optimization: false } | Scrolling settings. - frictionalForce - Frictional force. Default value is 0.035. - mass - Mass. Default value is 0.005. - maxDistance - Maximum scrolling distance. Default value is 100000. - maxDuration - Maximum animation duration. Default value is 4000. - speedScale - Speed scale. Default value is 10. - breakpointStoppingFactor - Default value is 10. - optimization - Enables scrolling performance optimization. Default value is `true`. |
| animationParams | [INtSliderAnimationParams](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/slider/interfaces/nt-slider-animation-params.ts) = { scroll: 500, snapByDivision: 250 } | Animation parameters. The default value is "{ scroll: 500, snapByDivision: 250 }". |
| snappingDistance | [SnappingDistance](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/snapping-distance.ts) = '25%' | Snapping activation distance. Can be specified as a percentage of the element size or in absolute values. The default value is `25%`. |
| thumbSize | [ArithmeticExpression](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/arithmetic-expression.ts) = '25%' | Slider thumb size. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". Default value is `25%`. |
| overscrollAreaLeftRenderer | TemplateRef<any> \| null = null | Specifies a custom template for the left overscroll area. |
| overscrollAreaTopRenderer | TemplateRef<any> \| null = null boolean = false | Specifies a custom template for the top overscroll area. |
| overscrollAreaRightRenderer | TemplateRef<any> \| null = null | Specifies a custom template for the right overscroll area. |
| overscrollAreaBottomRenderer | TemplateRef<any> \| null = null | Specifies a custom template for the bottom overscroll area. |
| langTextDir | [TextDirection](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/text-direction.ts) | A string indicating the direction of text for the locale. Can be either "ltr" (left-to-right) or "rtl" (right-to-left). |

<br/>

Outputs

| Event | Type | Description |
|---|---|---|
| onDrag | ([ISliderDragEvent](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/slider/components/ng-base-slider/interfaces/slider-drag-data.ts)) => void | Fires a drag event. |
| onDragEnd | ([ISliderDragEvent](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/slider/components/ng-base-slider/interfaces/slider-drag-data.ts)) => void | Fires a drag end event. |
| onSnap | [Id](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/id.ts) | Triggers an event with a step ID when the step moves the specified distance. |
| onChange | number | Triggers an event when the value changes. |
| onVirtualClick | PointerEvent \| TouchEvent | Triggers an event when clicked. |
| onTrackVirtualClick | PointerEvent \| TouchEvent | Clicking on a track triggers an event. |
