# Centrifugal

## [NtDrawerComponent](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/drawer/nt-drawer.component.ts)

Inputs

| Property | Type | Description |
|---|---|---|
| animationParams | [INtDrawerAnimationParams](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/drawer/interfaces/nt-drawer-animation-params.ts)? = { scrollToItem: 500, snapToItem: 500 } | Animation parameters. The default value is "{ scrollToItem: 500, snapToItem: 500 }". |
| axleLock | boolean? = false | Determines whether axis locking will occur during scrolling. Default value is "false". |
| backdrop | boolean? = true | Determines whether the content will be covered by an overlay when clicked to close the dock. Default value is `true`. |
| dockLeftSize | [ArithmeticExpression](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/arithmetic-expression.ts) = 0 | Sets the dock left size. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". |
| dockTopSize | [ArithmeticExpression](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/arithmetic-expression.ts) = 0 | Sets the dock top size. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". |
| dockRightSize | [ArithmeticExpression](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/arithmetic-expression.ts) = 0 | Sets the dock right size. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". |
| dockBottomSize | [ArithmeticExpression](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/arithmetic-expression.ts) = 0 | Sets the dock bottom size. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". |
| dockLeft | TemplateRef<any> \| null = null | Left dock. |
| dockTop | TemplateRef<any> \| null = null | Top dock. |
| dockRight | TemplateRef<any> \| null = null | Right dock. |
| dockBottom | TemplateRef<any> \| null = null | Bottom dock. |
| clickDistance | number? = 40 | The maximum scroll distance at which a click event is triggered. |
| direction | [Direction? = 'both'](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/direction.ts) | Determines the direction in which elements are placed. Default value is "both". |
| id | number | Readonly. Returns the unique identifier of the component. |
| maxMotionBlur | number = 0.5 | Maximum motion blur effect. The default value is `0.5`. |
| motionBlur | number \| 'disabled' = 0.15 | Motion blur effect. The default value is `0.25`. |
| motionBlurEnabled | boolean = false | Determines whether to apply motion blur or not. The default value is `false`. |
| overscrollEnabled | boolean? = true | Determines whether the overscroll (re-scroll) feature will work. The default value is "true". |
| overscrollAreaUseOffsets | boolean = false | If true, scrollLeftOffset, scrollTopOffset, scrollRightOffset, and scrollBottomOffset will be used when calculating the re-scroll indicator positions. |
| overscrollAreaLeftEnabled | boolean = false | Determines whether to display the left overscroll area if the parameter value is true or not if it is false. If the overscrollAreaShowAutomatically property is set to true and overscrollAreaLeftEnabled="false", the indicator will be used if horizontal scrolling is available. |
| overscrollAreaTopEnabled | boolean = false | Determines whether to display the top overscroll area if the parameter value is true or not if it is false. If the overscrollAreaShowAutomatically property is set to true and overscrollAreaTopEnabled="false", the indicator will be used if vertical scrolling is available. |
| overscrollAreaRightEnabled | boolean = false | Determines whether to display the right overscroll area if the parameter value is true or not if it is false. If the overscrollAreaShowAutomatically property is set to true and overscrollAreaRightEnabled="false", the indicator will be used if horizontal scrolling is available. |
| overscrollAreaBottomEnabled | boolean = false | Determines whether to display the bottom overscroll area if the parameter value is true or not if it is false. If the overscrollAreaShowAutomatically property is set to true and overscrollAreaBottomEnabled="false", the indicator will be used if vertical scrolling is available. |
| overscrollAreaLeftRenderer | TemplateRef<any> \| null = null | Specifies a custom template for the left overscroll area. |
| overscrollAreaTopRenderer | TemplateRef<any> \| null = null boolean = false | Specifies a custom template for the top overscroll area. |
| overscrollAreaRightRenderer | TemplateRef<any> \| null = null | Specifies a custom template for the right overscroll area. |
| overscrollAreaBottomRenderer | TemplateRef<any> \| null = null | Specifies a custom template for the bottom overscroll area. |
| snappingDistance | [SnappingDistance](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/snapping-distance.ts) = "5%" | Snapping activation distance. Can be specified as a percentage of the element size or in absolute values. The default value is `5%`. |
| scrollLeftOffset | [FloatOrPersentageValue](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/float-or-persentage-value.ts) = 0 | Sets the scroll left offset value. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". |
| scrollRightOffset | [FloatOrPersentageValue](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/float-or-persentage-value.ts) = 0 | Sets the scroll right offset value. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". |
| scrollTopOffset | [FloatOrPersentageValue](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/float-or-persentage-value.ts) = 0 | Sets the scroll top offset value. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". |
| scrollBottomOffset | [FloatOrPersentageValue](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/float-or-persentage-value.ts) = 0 | Sets the scroll bottom offset value. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". |
| scrollBehavior | ScrollBehavior? = 'smooth' | Defines the scrolling behavior for any element on the page. The default value is "smooth". |
| scrollingSettings | [IScrollingSettings](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/scrolling-settings.ts) = {frictionalForce: 0.035, mass: 0.005, maxDistance: 100000, maxDuration: 4000, speedScale: 10, optimization: true} | Scrolling settings. |

<br/>

Outputs

| Event | Type | Description |
|---|---|---|
| onOpen | [DrawerDockPosition](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/drawer/types/drawer-dock-position.ts) | Triggered when the drawer is opened. |
| onClose | void | Triggered when the drawer is closed. |
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
| open | (position: [DrawerDockPosition](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/drawer/types/drawer-dock-position.ts)) | Opens the dock at the specified position. |
| close |  | Closes the dock. |
