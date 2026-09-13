# Centrifugal

## [NtSheetComponent](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/sheet/nt-sheet.component.ts)

Inputs

| Property | Type | Description |
|---|---|---|
| breakpoints | [INtSheetBreakpoints](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/sheet/interfaces/nt-sheet-breakpoints.ts) = [{ id: 'start', position: '0%' }, { id: 'end', position: '100%' }] | Opening breakpoints. |
| breakpointTriggerDistance | number | Breakpoint trigger distance. Specified as a percentage from 0 to 1. |
| snappingDistance | [SnappingDistance](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/snapping-distance.ts) = '10%' | Snapping activation distance. Can be specified as a percentage of the element size or in absolute values. The default value is `25%`. |
| clickDistance | number = 40 | The maximum scroll distance at which a click event is triggered. |
| scrollStartOffset | [ArithmeticExpression](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/arithmetic-expression.ts) = 0 | Sets the scroll start offset value. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". |
| scrollEndOffset | [ArithmeticExpression](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/arithmetic-expression.ts) = 0 | Sets the scroll end offset value. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". |
| scrollBehavior | ScrollBehavior = 'smooth' | Defines the scrolling behavior for any element on the page. The default value is "smooth". |
| scrollingSettings | [IScrollingSettings](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/scrolling-settings.ts) = { frictionalForce: 0.035, mass: 0.005, maxDistance: 100000, maxDuration: 4000, speedScale: 10, breakpointStoppingFactor: 0.01, optimization: false } | Scrolling settings. - frictionalForce - Frictional force. Default value is 0.035. - mass - Mass. Default value is 0.005. - maxDistance - Maximum scrolling distance. Default value is 100000. - maxDuration - Maximum animation duration. Default value is 4000. - speedScale - Speed scale. Default value is 10. - optimization - Enables scrolling performance optimization. Default value is `true`. |
| motionBlur | number = 0.15 | Motion blur effect. The default value is `0.15`. |
| maxMotionBlur | number = 0.5 | Maximum motion blur effect. The default value is `0.5`. |
| motionBlurEnabled | boolean = false | Determines whether to apply motion blur or not. The default value is `false`. |
| animationParams | [INtSheetAnimationParams](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/sheet/interfaces/nt-sheet-animation-params.ts) = { fadeIn: 500, fadeOut: 500 } | Animation parameters. The default value is "{ fadeIn: 500, fadeOut: 500 }". |
| overscrollEnabled | boolean = true | Determines whether the overscroll (re-scroll) feature will work. The default value is "true". |
| position | [SheetPosition](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/sheet/types/sheet-position.ts) = 'bottom' | Determines the position in which elements are placed. Default value is "bottom". |
| langTextDir | [TextDirection](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/text-direction.ts) | A string indicating the direction of text for the locale. Can be either "ltr" (left-to-right) or "rtl" (right-to-left). |
| overscrollAreaShowAutomatically | boolean = false | Sets whether overscroll areas are automatically displayed if the value is false. |
| overscrollAreaUseOffsets | boolean = false | If true, scrollLeftOffset, scrollTopOffset, scrollRightOffset, and scrollBottomOffset will be used when calculating the re-scroll indicator positions. |
| overscrollAreaLeftEnabled | boolean = false | Determines whether to display the left overscroll area if the parameter value is true or not if it is false. If the overscrollAreaShowAutomatically property is set to true and overscrollAreaLeftEnabled="false", the indicator will be used if horizontal scrolling is available. |
| overscrollAreaTopEnabled | boolean = false | Determines whether to display the top overscroll area if the parameter value is true or not if it is false. If the overscrollAreaShowAutomatically property is set to true and overscrollAreaTopEnabled="false", the indicator will be used if vertical scrolling is available. |
| overscrollAreaRightEnabled | boolean = false | Determines whether to display the right overscroll area if the parameter value is true or not if it is false. If the overscrollAreaShowAutomatically property is set to true and overscrollAreaRightEnabled="false", the indicator will be used if horizontal scrolling is available. |
| overscrollAreaBottomEnabled | boolean = false | Determines whether to display the bottom overscroll area if the parameter value is true or not if it is false. If the overscrollAreaShowAutomatically property is set to true and overscrollAreaBottomEnabled="false", the indicator will be used if vertical scrolling is available. |
| overscrollAreaLeftRenderer | TemplateRef<any> \| null = null | Specifies a custom template for the left overscroll area. |
| overscrollAreaTopRenderer | TemplateRef<any> \| null = null boolean = false | Specifies a custom template for the top overscroll area. |
| overscrollAreaRightRenderer | TemplateRef<any> \| null = null | Specifies a custom template for the right overscroll area. |
| overscrollAreaBottomRenderer | TemplateRef<any> \| null = null | Specifies a custom template for the bottom overscroll area. |

<br/>

Outputs

| Event | Type | Description |
|---|---|---|
| onScroll | ([IScrollViewScrollEvent](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/scroll-view-scroll-event.ts)) => void | Fires when the list has been scrolled. |
| onScrollEnd | ([IScrollViewScrollEvent](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/scroll-view-scroll-event.ts)) => void | Fires when the list has completed scrolling. |
| onViewportChange | [ISize](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/size.ts) | Fires when the viewport size is changed. |
| onBreakpoint | [INtSheetBreakpointEvent](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/sheet/interfaces/nt-sheet-breakpoint-event.ts) | Fires information about the breakpoint position. |
| onOverscroll | [IOverscrollEvent](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/overscroll-event.ts) | Dispatches an overscroll event. |
| onLeftOverscrollAreaTrigger | boolean | Fires when the left overscroll area has reached its position limit. |
| onTopOverscrollAreaTrigger | boolean | Fires when the top overscroll area has reached its position limit. |
| onRightOverscrollAreaTrigger | boolean | Fires when the right overscroll area has reached its position limit. |
| onBottomOverscrollAreaTrigger | boolean | Fires when the bottom overscroll area has reached its position limit. |

<br/>

Methods

| Method | Type | Description |
|--|--|--|
| scrollTo | (id: [Id](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/id.ts), (cb: () => void) \| null = null, options: [IScrollOptions](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/interfaces/scroll-options.ts) \| null = null) | The method scrolls the list to the element with the given `id` and returns the value of the scrolled area. |
| open | void | Enables the display of the sheet. |
| close | void | Hides the sheet. |
