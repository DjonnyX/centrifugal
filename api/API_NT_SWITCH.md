# Centrifugal

## [NtSwitchComponent](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/switch/nt-switch.component.ts)

Inputs

| Property | Type | Description |
|---|---|---|
| value | boolean = false | Switch value. Default value is `false`. |
| direction | [SDirection](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/core/nt-s-scroller/types/s-direction.ts) = "horizontal" | Determines the slider direction. Default value is "horizontal". |
| interactive | boolean = true | Determines whether the slider will respond to user interaction or not. The default value is `true`. |
| animationParams | [INtSwitchAnimationParams](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/switch/interfaces/nt-switch-animation-params.ts) = { scroll: 500, snapByDivision: 250 } | Animation parameters. The default value is "{ scroll: 500, snapByDivision: 250 }". |
| contentScale | number = 1.05 | Scale of content. Default value is `1.05`. |
| thumbSize | [ArithmeticExpression](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/arithmetic-expression.ts) = '25%' | Switch thumb size. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". Default value is `50%`. | 
| thumbAnimationDuration | string = "150ms" | Content scale. Default value is `150ms`. |
| snappingDistance | [SnappingDistance](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/snapping-distance.ts) = "50%" | Snapping activation distance. Can be specified as a percentage of the element size or in absolute values. The default value is `50%`. |
| motionBlur | number = 5 | Motion blur effect. The default value is `5`. |
| maxMotionBlur | number = 10 | Maximum motion blur effect. The default value is `10`. |
| motionBlurEnabled | boolean = false | Determines whether to apply motion blur or not. The default value is `false`. |
| scrollingSettings | [IScrollingSettings](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/scrolling-settings.ts) = { frictionalForce: 0.035, mass: 0.005, maxDistance: 100000, maxDuration: 4000, speedScale: 10, breakpointStoppingFactor: 10, optimization: false } | Scrolling settings. - frictionalForce - Frictional force. Default value is 0.035. - mass - Mass. Default value is 0.005. - maxDistance - Maximum scrolling distance. Default value is 100000. - maxDuration - Maximum animation duration. Default value is 4000. - speedScale - Speed scale. Default value is 10. - breakpointStoppingFactor - Default value is 10. - optimization - Enables scrolling performance optimization. Default value is `true`. |
| overscrollAreaLeftRenderer | TemplateRef<any> \| null = null | Specifies a custom template for the left overscroll area. |
| overscrollAreaTopRenderer | TemplateRef<any> \| null = null boolean = false | Specifies a custom template for the top overscroll area. |
| overscrollAreaRightRenderer | TemplateRef<any> \| null = null | Specifies a custom template for the right overscroll area. |
| overscrollAreaBottomRenderer | TemplateRef<any> \| null = null | Specifies a custom template for the bottom overscroll area. |
| langTextDir | [TextDirection](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/text-direction.ts) | A string indicating the direction of text for the locale. Can be either "ltr" (left-to-right) or "rtl" (right-to-left). |

<br/>

Outputs

| Event | Type | Description |
|---|---|---|
| onChange | boolean | Triggers an event when the value changes. |
