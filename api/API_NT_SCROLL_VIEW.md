# Centrifugal

## [NtScrollViewComponent](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/nt-scroll-view.component.ts)

Inputs

| Property | Type | Description |
|---|---|---|
| animationParams | [INtScrollViewAnimationParams](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/interfaces/nt-scroll-view-animation-params.ts)? = { scrollToItem: 500, snapToItem: 500 } | Animation parameters. The default value is "{ scrollToItem: 500, snapToItem: 250 }". |
| axleLock | boolean? = false | Determines whether axis locking will occur during scrolling. Default value is "false". |
| clickDistance | number? = 40 | The maximum scroll distance at which a click event is triggered. |
| direction | [Direction? = 'both'](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/direction.ts) | Determines the direction in which elements are placed. Default value is "both". |
| id | number | Readonly. Returns the unique identifier of the component. | 
| langTextDir | [TextDirection? = 'ltr'](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/text-direction.ts) | A string indicating the direction of text for the locale. Can be either "ltr" (left-to-right) or "rtl" (right-to-left). |
| loading | boolean? = false | If `true`, the scrollBar goes into loading state. The default value is `false`. |
| maxMotionBlur | number = 0.5 | Maximum motion blur effect. The default value is `0.5`. |
| motionBlur | number \| 'disabled' = 0.15 | Motion blur effect. The default value is `0.25`. |
| motionBlurEnabled | boolean = false | Determines whether to apply motion blur or not. The default value is `false`. |
| overscrollEnabled | boolean? = true | Determines whether the overscroll (re-scroll) feature will work. The default value is "true". |
| overlappingScrollbar | boolean? = false | Determines whether the scroll bar will overlap the list. The default value is "false". |
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
| snappingDistance | [SnappingDistance](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/snapping-distance.ts) = "25%" | Snapping activation distance. Can be specified as a percentage of the element size or in absolute values. The default value is `25%`. |
| scrollLeftOffset | [FloatOrPersentageValue](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/float-or-persentage-value.ts) = 0 | Sets the scroll left offset value. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". |
| scrollRightOffset | [FloatOrPersentageValue](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/float-or-persentage-value.ts) = 0 | Sets the scroll right offset value. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". |
| scrollTopOffset | [FloatOrPersentageValue](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/float-or-persentage-value.ts) = 0 | Sets the scroll top offset value. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". |
| scrollBottomOffset | [FloatOrPersentageValue](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/float-or-persentage-value.ts) = 0 | Sets the scroll bottom offset value. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". |
| snapScrollToLeft | boolean? = true | Determines whether the scrollbar is snapped to the left of the scroller. The default value is "true". That is, if `snapScrollToLeft` and `snapScrollToRight` are enabled, the scroller will initially snap to the left; if you move the scrollbar right, the scroller will snap to the right. If `snapScrollToLeft` is disabled and `snapScrollToRight` is enabled, the scroller will snap to the right; If you move the scrollbar left, the scroller will snap to the left. If both `snapScrollToLeft` and `snapScrollToRight` are disabled, the scroller will never snap to the left or right. |
| snapScrollToRight | boolean? = true | Determines whether the scrollbar is snapped to the right of the scroller. The default value is "true". That is, if `snapScrollToRight` and `snapScrollToRight` are enabled, the scroller will initially snap to the left; if you move the scrollbar right, the scroller will snap to the right. If `snapScrollToLeft` is disabled and `snapScrollToRight` is enabled, the scroller will snap to the right; If you move the scrollbar left, the scroller will snap to the left. If both `snapScrollToLeft` and `snapScrollToRight` are disabled, the scroller will never snap to the left or right. |
| snapScrollToTop | boolean? = true | Determines whether the scrollbar is snapped to the top of the scroller. The default value is "true". That is, if `snapScrollToTop` and `snapScrollToBottom` are enabled, the scroller will initially snap to the top; if you move the scrollbar down, the scroller will snap to the bottom. If `snapScrollToTop` is disabled and `snapScrollToBottom` is enabled, the scroller will snap to the bottom; If you move the scrollbar up, the scroller will snap to the top. If both `snapScrollToTop` and `snapScrollToBottom` are disabled, the scroller will never snap to the top or bottom. |
| snapScrollToBottom | boolean? = true | Determines whether the scrollbar is snapped to the bottom of the scroller. The default value is "true". That is, if `snapScrollToTop` and `snapScrollToBottom` are enabled, the scroller will initially snap to the top; if you move the scrollbar down, the scroller will snap to the bottom. If `snapScrollToTop` is disabled and `snapScrollToBottom` is enabled, the scroller will snap to the bottom; If you move the scrollbar up, the scroller will snap to the top. If both `snapScrollToTop` and `snapScrollToBottom` are disabled, the scroller will never snap to the top or bottom. |
| scrollable | boolean? = true | Determines whether the scrollbar is shown or not. The default value is "true". |
| scrollbarEnabled | boolean? = true | Determines whether the scrollbar is shown or not. The default value is "true". |
| scrollbarInteractive | boolean? = true | Determines whether scrolling using the scrollbar will be possible. The default value is "true". |
| scrollbarMinSize | number? = 80 | Minimum scrollbar size. |
| scrollbarThickness | number? = 6 | Scrollbar thickness. |
| scrollbarThumbRenderer | TemplateRef<any> \| null = null | Scrollbar customization template. |
| scrollbarThumbParams | {[propName: string]: any;} \| null | Additional options for the scrollbar. |
| scrollBehavior | ScrollBehavior? = 'smooth' | Defines the scrolling behavior for any element on the page. The default value is "smooth". |
| scrollingSettings | [IScrollingSettings](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/scrolling-settings.ts) = {frictionalForce: 0.035, mass: 0.005, maxDistance: 100000, maxDuration: 4000, speedScale: 10, optimization: true} | Scrolling settings. |

<br/>

Outputs

| Event | Type | Description |
|---|---|---|
| onScroll | ([IScrollEvent](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/interfaces/scroll-event.ts)) => void | Fires when the list has been scrolled. |
| onScrollEnd | ([IScrollEvent](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/interfaces/scroll-event.ts)) => void | Fires when the list has completed scrolling. |
| onViewportChange | [ISize](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/size.ts) | Fires when the viewport size is changed. |
| onScrollReachLeft | void | Fires when the scroll reaches the left. |
| onScrollReachRight | void | Fires when the scroll reaches the right. |
| onScrollReachTop | void | Fires when the scroll reaches the top. |
| onScrollReachBottom | void | Fires when the scroll reaches the bottom. |
| onLeftOverscrollAreaTrigger | boolean | Fires when the left overscroll area has reached its position limit. |
| onTopOverscrollAreaTrigger | boolean | Fires when the top overscroll area has reached its position limit. |
| onRightOverscrollAreaTrigger | boolean | Fires when the right overscroll area has reached its position limit. |
| onBottomOverscrollAreaTrigger | boolean | Fires when the bottom overscroll area has reached its position limit. |

<br/>

Methods

| Method | Type | Description |
|--|--|--|
| scrollTo | (options: [IScrollOptions](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/interfaces/scroll-options.ts)) => Array<number> \| null | The method scrolls the scroll view and returns the animation ids if the behavior is set to smooth or null if the behavior is set to auto, instant, or not set. |
