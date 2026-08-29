# Centrifugal

<img width="1033" height="171" alt="logo" src="https://github.com/user-attachments/assets/b559cfde-405a-4361-b71b-6715478d997d" />

<b>Angular version 19v. - 22v.</b>. <br/>

[Documentation](https://centrifugal.eugene-grebennikov.pro/)

<br/><br/>

🚀 A high-performance web-centric development kit for building mobile-like user interfaces. <br/> <br/>
🛠️ Fast, customizable and developer-friendly. <br/> <br/>
⚡A powerful API for implementing components of varying functionality and complexity. <br/> <br/>
💻 Works correctly in all browsers and platforms. <br/> <br/>
💪 The software portion of the project was completed without a single line of code written using AI (artificial intelligence)! <br/>

<br/>

## 📱 When to Use It: Ideal Use Cases

Platform-independent web applications. Scrolling, animation, and mechanics should look consistent across all browsers, including desktop and mobile devices.

User interfaces for self-service terminals.

PWA platform-independent apps. The mechanics should be identical on any platform.

<br/>

## 📦 Installation

```bash
npm i centrifugal
```

<br/>

## 🚀 Quick Start
```html
<nt-control-container [keyboardEnabled]="true">
  <nt-scroll-view #scrollView class="scroll-view" direction="both">
    <div class="scroll-view__background" [style.width.px]="3000" [style.height.px]="3000" [class.grabbing]="scrollView.$grabbing | async"></div>
  </nt-scroll-view>

  <nt-list [items]="items" [bufferSize]="5" [itemRenderer]="itemRenderer" [dynamicSize]="false" [itemSize]="64"></nt-list>

  <ng-template #itemRenderer let-data="data">
    @if (data) {
        <span>{{data.name}}</span>
    }
  </ng-template>
</nt-control-container>
```
```ts
items = Array.from({ length: 100000 }, (_, i) => ({ id: i, name: `Item #${i}` }));
```

<br/>

## 📚 API

### [NtScrollViewComponent](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/nt-scroll-view.component.ts)

Inputs

| Property | Type | Description |
|---|---|---|
| keyboardEnabled | boolean = true | Determines whether to show the virtual keyboard for input fields or not. |
| keyboardSettings | [IKeyboardSettings](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/keyboard-settings.ts) | Sets settings for the virtual keyboard. |
| animationParams | [IAnimationParams](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/interfaces/animation-params.ts)? = { scrollToItem: 500, snapToItem: 500 } | Animation parameters. The default value is "{ scrollToItem: 150, snapToItem: 250 }". |
| direction | [Direction? = 'both'](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/direction.ts) | Determines the direction in which elements are placed. Default value is "both". |
| id | number | Readonly. Returns the unique identifier of the component. | 
| langTextDir | [TextDirection? = 'ltr'](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/text-direction.ts) | A string indicating the direction of text for the locale. Can be either "ltr" (left-to-right) or "rtl" (right-to-left). |
| loading | boolean? = false | If `true`, the scrollBar goes into loading state. The default value is `false`. |
| maxMotionBlur | number = 0.5 | Maximum motion blur effect. The default value is `0.5`. |
| motionBlur | number \| 'disabled' = 0.15 | Motion blur effect. The default value is `0.25`. |
| motionBlurEnabled | boolean = false | Determines whether to apply motion blur or not. The default value is `false`. |
| overlappingScrollbar | boolean? = false | Determines whether the scroll bar will overlap the list. The default value is "false". |
| overscrollAreaShowAutomatically | boolean = true | Sets whether overscroll areas are automatically displayed if the value is true. |
| overscrollAreaUseOffsets | boolean = false | If true, scrollLeftOffset, scrollTopOffset, scrollRightOffset, and scrollBottomOffset will be used when calculating the re-scroll indicator positions. |
| overscrollAreaLeftEnabled | boolean = false | Determines whether to display the left overscroll area if the parameter value is true or not if it is false. If the overscrollAreaShowAutomatically property is set to true and overscrollAreaLeftEnabled="false", the indicator will be used if horizontal scrolling is available. |
| overscrollAreaTopEnabled | boolean = false | Determines whether to display the top overscroll area if the parameter value is true or not if it is false. If the overscrollAreaShowAutomatically property is set to true and overscrollAreaTopEnabled="false", the indicator will be used if vertical scrolling is available. |
| overscrollAreaRightEnabled | boolean = false | Determines whether to display the right overscroll area if the parameter value is true or not if it is false. If the overscrollAreaShowAutomatically property is set to true and overscrollAreaRightEnabled="false", the indicator will be used if horizontal scrolling is available. |
| overscrollAreaBottomEnabled | boolean = false | Determines whether to display the bottom overscroll area if the parameter value is true or not if it is false. If the overscrollAreaShowAutomatically property is set to true and overscrollAreaBottomEnabled="false", the indicator will be used if vertical scrolling is available. |
| overscrollAreaLeftRenderer | TemplateRef<any> \| null = null | Specifies a custom template for the left overscroll area. |
| overscrollAreaTopRenderer | TemplateRef<any> \| null = null boolean = false | Specifies a custom template for the top overscroll area. |
| overscrollAreaRightRenderer | TemplateRef<any> \| null = null | Specifies a custom template for the right overscroll area. |
| overscrollAreaBottomRenderer | TemplateRef<any> \| null = null | Specifies a custom template for the bottom overscroll area. |
| scrollLeftOffset | [FloatOrPersentageValue](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/float-or-persentage-value.ts) = 0 | Sets the scroll left offset value. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". |
| scrollRightOffset | [FloatOrPersentageValue](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/float-or-persentage-value.ts) = 0 | Sets the scroll right offset value. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". |
| scrollTopOffset | [FloatOrPersentageValue](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/float-or-persentage-value.ts) = 0 | Sets the scroll top offset value. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". |
| scrollBottomOffset | [FloatOrPersentageValue](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/float-or-persentage-value.ts) = 0 | Sets the scroll bottom offset value. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". |
| snapScrollToLeft | boolean? = true | Determines whether the scrollbar is snapped to the left of the scroller. The default value is "true". That is, if `snapScrollToLeft` and `snapScrollToRight` are enabled, the scroller will initially snap to the left; if you move the scrollbar right, the scroller will snap to the right. If `snapScrollToLeft` is disabled and `snapScrollToRight` is enabled, the scroller will snap to the right; If you move the scrollbar left, the scroller will snap to the left. If both `snapScrollToLeft` and `snapScrollToRight` are disabled, the scroller will never snap to the left or right. |
| snapScrollToRight | boolean? = true | Determines whether the scrollbar is snapped to the right of the scroller. The default value is "true". That is, if `snapScrollToRight` and `snapScrollToRight` are enabled, the scroller will initially snap to the left; if you move the scrollbar right, the scroller will snap to the right. If `snapScrollToLeft` is disabled and `snapScrollToRight` is enabled, the scroller will snap to the right; If you move the scrollbar left, the scroller will snap to the left. If both `snapScrollToLeft` and `snapScrollToRight` are disabled, the scroller will never snap to the left or right. |
| snapScrollToTop | boolean? = true | Determines whether the scrollbar is snapped to the top of the scroller. The default value is "true". That is, if `snapScrollToTop` and `snapScrollToBottom` are enabled, the scroller will initially snap to the top; if you move the scrollbar down, the scroller will snap to the bottom. If `snapScrollToTop` is disabled and `snapScrollToBottom` is enabled, the scroller will snap to the bottom; If you move the scrollbar up, the scroller will snap to the top. If both `snapScrollToTop` and `snapScrollToBottom` are disabled, the scroller will never snap to the top or bottom. |
| snapScrollToBottom | boolean? = true | Determines whether the scrollbar is snapped to the bottom of the scroller. The default value is "true". That is, if `snapScrollToTop` and `snapScrollToBottom` are enabled, the scroller will initially snap to the top; if you move the scrollbar down, the scroller will snap to the bottom. If `snapScrollToTop` is disabled and `snapScrollToBottom` is enabled, the scroller will snap to the bottom; If you move the scrollbar up, the scroller will snap to the top. If both `snapScrollToTop` and `snapScrollToBottom` are disabled, the scroller will never snap to the top or bottom. |
| scrollable | boolean? = true | Determines whether the scrollbar is shown or not. The default value is "true". |
| scrollBehavior | ScrollBehavior? = 'smooth' | Defines the scrolling behavior for any element on the page. The default value is "smooth". |
| scrollingSettings | [IScrollingSettings](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/interfaces/scrolling-settings.ts) = {frictionalForce: 0.035, mass: 0.005, maxDistance: 100000, maxDuration: 4000, speedScale: 10, optimization: true} | Scrolling settings. |

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
<br/>

### [NtScrollViewComponent](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/nt-scroll-view.component.ts)

Inputs

| Property | Type | Description |
|---|---|---|
| animationParams | [IAnimationParams](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/interfaces/animation-params.ts)? = { scrollToItem: 500, snapToItem: 500 } | Animation parameters. The default value is "{ scrollToItem: 150, snapToItem: 250 }". |
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
| overscrollAreaShowAutomatically | boolean = true | Sets whether overscroll areas are automatically displayed if the value is true. |
| overscrollAreaUseOffsets | boolean = false | If true, scrollLeftOffset, scrollTopOffset, scrollRightOffset, and scrollBottomOffset will be used when calculating the re-scroll indicator positions. |
| overscrollAreaLeftEnabled | boolean = false | Determines whether to display the left overscroll area if the parameter value is true or not if it is false. If the overscrollAreaShowAutomatically property is set to true and overscrollAreaLeftEnabled="false", the indicator will be used if horizontal scrolling is available. |
| overscrollAreaTopEnabled | boolean = false | Determines whether to display the top overscroll area if the parameter value is true or not if it is false. If the overscrollAreaShowAutomatically property is set to true and overscrollAreaTopEnabled="false", the indicator will be used if vertical scrolling is available. |
| overscrollAreaRightEnabled | boolean = false | Determines whether to display the right overscroll area if the parameter value is true or not if it is false. If the overscrollAreaShowAutomatically property is set to true and overscrollAreaRightEnabled="false", the indicator will be used if horizontal scrolling is available. |
| overscrollAreaBottomEnabled | boolean = false | Determines whether to display the bottom overscroll area if the parameter value is true or not if it is false. If the overscrollAreaShowAutomatically property is set to true and overscrollAreaBottomEnabled="false", the indicator will be used if vertical scrolling is available. |
| overscrollAreaLeftRenderer | TemplateRef<any> \| null = null | Specifies a custom template for the left overscroll area. |
| overscrollAreaTopRenderer | TemplateRef<any> \| null = null boolean = false | Specifies a custom template for the top overscroll area. |
| overscrollAreaRightRenderer | TemplateRef<any> \| null = null | Specifies a custom template for the right overscroll area. |
| overscrollAreaBottomRenderer | TemplateRef<any> \| null = null | Specifies a custom template for the bottom overscroll area. |
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
| scrollingSettings | [IScrollingSettings](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/interfaces/scrolling-settings.ts) = {frictionalForce: 0.035, mass: 0.005, maxDistance: 100000, maxDuration: 4000, speedScale: 10, optimization: true} | Scrolling settings. |

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

<br/>
<br/>

### [NtListComponent](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/nt-list.component.ts)

Inputs

| Property | Type | Description |
|---|---|---|
| alignment | [Alignment](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/types/alignment.ts) | Determines the alignment of the list. Two modes are available: `none` and `center`. The `center` mode aligns the list items to the center of the viewport, ideal for use with the `itemTransform` property. The `none` mode means no alignment. The default value is `none`. |
| animationParams | [IAnimationParams](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/interfaces/animation-params.ts)? = { scrollToItem: 150, snapToItem: 150, navigateToItem: 150, navigateByKeyboard: 50 } | Animation parameters. The default value is "{ scrollToItem: 150, snapToItem: 150, navigateToItem: 150, navigateByKeyboard: 50 }". |
| bufferSize | number? = 2 | Number of elements outside the scope of visibility. Default value is 2. |
| clickDistance | number? = 40 | The maximum scroll distance at which a click event is triggered. |
| collapsedIds | Array<[Id](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/id.ts)> | Sets the collapsed items. |
| collapseByClick | boolean? = true | If `false`, the element is collapsed using the config.collapse method passed to the template; if `true`, the element is collapsed by clicking on it. The default value is `true`. |
| collapsingMode | [CollapsingMode](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/enums/collapsing-modes.ts) |  Mode for collapsing list items. Default value is `none`. `none` - List items are not selectable. `multi-collapse` - List items are collapsed one by one. 'accordion' - Accordion collapsible list items. Default value is `none`. |
| collectionMode | [CollectionMode? = 'normal'](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/types/collection-mode.ts) | Determines the action modes for collection elements. Default value is `normal`. |
| divides | number = 1 | Column or row numbers. The default value is `1`. |
| direction | [Direction? = 'vertical'](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/direction.ts) | Determines the direction in which elements are placed. Default value is "vertical". |
| dynamicSize | boolean? = true | If true, items in the list may have different sizes, and the itemSize property must be specified to adjust the sizes of items in the unallocated area. If false then the items in the list have a fixed size specified by the itemSize property. The default value is true. |
| enabledBufferOptimization | boolean? = false | Experimental! Enables buffer optimization. Can only be used if items in the collection are not added or updated. |
| id | number | Readonly. Returns the unique identifier of the component. | 
| items | [IVirtualListCollection](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/models/collection.model.ts) | Collection of list items. The collection of elements must be immutable. |
| itemSize | number \| 'viewport' = 24 | If direction = 'vertical', then the height of a typical element. If direction = 'horizontal', then the width of a typical element. If the dynamicSize property is true, the items in the list can have different sizes, and you must specify the itemSize property to adjust the sizes of the items in the unallocated area. If the value is 'viewport', the sizes of elements are automatically resized to fit the viewport size. |
| itemTransform | [ItemTransform](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/types/item-transform.ts) \| null = null | Custom transformation of element's position, rotation, scale, opacity and zIndex. The default value is `null`. |
| itemRenderer | TemplateRef | Rendering element template. |
| itemConfigMap | [IVirtualListItemConfigMap?](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/models/item-config-map.model.ts) | Sets `sticky` position, `fullSize`, `collapsable` and `selectable` for the list item element. If `sticky` position is greater than `0`, then `sticky` position is applied. If the `sticky` value is greater than `0`, then the `sticky` position mode is enabled for the element. `1` - position start, `2` - position end. Default value is `0`. `selectable` determines whether an element can be selected or not. Default value is `true`. `collapsable` determines whether an element with a `sticky` property greater than zero can collapse and collapse elements in front that do not have a `sticky` property. `fullSize` determines the size of an element when rendering lists with cell divisions. If sticky is 1 or 2, fullSize automatically becomes true. The default value is false. |
| langTextDir | [TextDirection? = 'ltr'](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/text-direction.ts) | A string indicating the direction of text for the locale. Can be either "ltr" (left-to-right) or "rtl" (right-to-left). |
| loading | boolean? = false | If `true`, the scrollBar goes into loading state. The default value is `false`. |
| maxBufferSize | number? = 10 | Maximum number of elements outside the scope of visibility. Default value is 10. If maxBufferSize is set to be greater than bufferSize, then adaptive buffer mode is enabled. The greater the scroll size, the more elements are allocated for rendering. |
| maxMotionBlur | number = 0.5 | Maximum motion blur effect. The default value is `0.5`. |
| selectingMode | [SelectingMode](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/types/selecting-mode.ts) | Method for selecting list items. Default value is 'none'. 'select' - List items are selected one by one. 'multi-select' - Multiple selection of list items. 'none' - List items are not selectable. |
| minItemSize | number \| 'viewport' = 1 | If the `dynamicSize` property is enabled, the minimum size of the element is set. If the value is 'viewport', the sizes of elements are automatically resized to fit the viewport size. |
| maxItemSize | number \| 'viewport' = Number.MAX_SAFE_INTEGER | If the `dynamicSize` property is enabled, the maximum size of the element is set. If the value is 'viewport', the sizes of elements are automatically resized to fit the viewport size. |
| motionBlur | number \| 'disabled' = 0.15 | Motion blur effect. The default value is `0.25`. |
| motionBlurEnabled | boolean = false | Determines whether to apply motion blur or not. The default value is `false`. |
| overscrollEnabled | boolean? = true | Determines whether the overscroll (re-scroll) feature will work. The default value is "true". |
| overlappingScrollbar | boolean? = false | Determines whether the scroll bar will overlap the list. The default value is "false". |
| overscrollAreaShowAutomatically | boolean = true | Sets whether overscroll areas are automatically displayed if the value is true. |
| overscrollAreaUseOffsets | boolean = false | If true, scrollLeftOffset, scrollTopOffset, scrollRightOffset, and scrollBottomOffset will be used when calculating the re-scroll indicator positions. |
| overscrollAreaLeftEnabled | boolean = false | Determines whether to display the left overscroll area if the parameter value is true or not if it is false. If the overscrollAreaShowAutomatically property is set to true and overscrollAreaLeftEnabled="false", the indicator will be used if horizontal scrolling is available. |
| overscrollAreaTopEnabled | boolean = false | Determines whether to display the top overscroll area if the parameter value is true or not if it is false. If the overscrollAreaShowAutomatically property is set to true and overscrollAreaTopEnabled="false", the indicator will be used if vertical scrolling is available. |
| overscrollAreaRightEnabled | boolean = false | Determines whether to display the right overscroll area if the parameter value is true or not if it is false. If the overscrollAreaShowAutomatically property is set to true and overscrollAreaRightEnabled="false", the indicator will be used if horizontal scrolling is available. |
| overscrollAreaBottomEnabled | boolean = false | Determines whether to display the bottom overscroll area if the parameter value is true or not if it is false. If the overscrollAreaShowAutomatically property is set to true and overscrollAreaBottomEnabled="false", the indicator will be used if vertical scrolling is available. |
| overscrollAreaLeftRenderer | TemplateRef<any> \| null = null | Specifies a custom template for the left overscroll area. |
| overscrollAreaTopRenderer | TemplateRef<any> \| null = null | Specifies a custom template for the top overscroll area. |
| overscrollAreaRightRenderer | TemplateRef<any> \| null = null | Specifies a custom template for the right overscroll area. |
| overscrollAreaBottomRenderer | TemplateRef<any> \| null = null | Specifies a custom template for the bottom overscroll area. |
| selectByClick | boolean? = true | If `false`, the element is selected using the config.select method passed to the template; if `true`, the element is selected by clicking on it. The default value is `true`. |
| stickyEnabled | boolean? = false | Determines whether items with the given `sticky` in `itemConfigMap` will stick to the edges. Default value is "false". |
| selectedIds | Array<[Id](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/id.ts)> \| [Id](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/id.ts) \| null | Sets the selected items. |
| screenReaderMessage | string? = "Showing items $1 to $2" | Message for screen reader. The message format is: "some text `$1` some text `$2`", where `$1` is the number of the first element of the screen collection, `$2` is the number of the last element of the screen collection. |
| waitForPreparation | boolean? = true | If true, it will wait until the list items are fully prepared before displaying them.. The default value is `true`. |
| scrollStartOffset | [FloatOrPersentageValue](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/float-or-persentage-value.ts) = 0 | Sets the scroll start offset value. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". |
| scrollEndOffset | [FloatOrPersentageValue](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/float-or-persentage-value.ts) = 0 | Sets the scroll end offset value. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". |
| snapToItem | boolean = false | Snap to an item. The default value is `false`. |
| snapToItemAlign | [SnapToItemAlign](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/types/snap-to-item-align.ts) = [SnapToItemAligns](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/enums/snap-to-item-aligns.ts).CENTER | Alignment for snapToItem. Available values ​​are `start`, `center`, and `end`. The default value is `center`. |
| snappingDistance | [SnappingDistance](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/types/snapping-distance.ts) = "25%" | Snapping activation distance. Can be specified as a percentage of the element size or in absolute values. The default value is `25%`. |
| snappingMethod | [SnappingMethod](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/types/snapping-method.ts) = [SnappingMethods.STANDART](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/enums/snapping-methods.ts) | Snapping method. Default value is [SnappingMethods.STANDART](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/types/snapping-method.ts). [SnappingMethods.STANDART](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/types/snapping-method.ts) - Classic group visualization. [SnappingMethods.ADVANCED](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/types/snapping-method.ts) - A mask is applied to the viewport area so that the background is displayed underneath the attached group. |
| snapScrollToStart | boolean? = true | Determines whether the scroll will be anchored to the start of the list. Default value is "true". This property takes precedence over the snapScrollToEnd property. That is, if snapScrollToStart and snapScrollToEnd are enabled, the list will initially snap to the beginning; if you move the scroll bar to the end, the list will snap to the end. If snapScrollToStart is disabled and snapScrollToEnd is enabled, the list will snap to the end; if you move the scroll bar to the beginning, the list will snap to the beginning. If both snapScrollToStart and snapScrollToEnd are disabled, the list will never snap to the beginning or end. In the `spreadingMode=SpreadingModes.INFINITY` mode, the `snapScrollToStart` property is automatically disabled, since the list has no beginning or end. |
| snapScrollToEnd | boolean? = true | Determines whether the scroll will be anchored to the утв of the list. Default value is "true". That is, if snapScrollToStart and snapScrollToEnd are enabled, the list will initially snap to the beginning; if you move the scroll bar to the end, the list will snap to the end. If snapScrollToStart is disabled and snapScrollToEnd is enabled, the list will snap to the end; if you move the scroll bar to the beginning, the list will snap to the beginning. If both snapScrollToStart and snapScrollToEnd are disabled, the list will never snap to the beginning or end. In the `spreadingMode=SpreadingModes.INFINITY` mode, the `snapScrollToEnd` property is automatically disabled, since the list has no beginning or end. |
| snapToEndTransitionInstantOffset | number? = 0 | Sets the offset value; if the scroll area value is exceeded, the scroll animation will be disabled. Default value is "0". |
| scrollbarEnabled | boolean? = true | Determines whether the scrollbar is shown or not. The default value is "true". |
| scrollbarInteractive | boolean? = true | Determines whether scrolling using the scrollbar will be possible. The default value is "true". |
| scrollbarMinSize | number? = 80 | Minimum scrollbar size. |
| scrollbarThickness | number? = 6 | Scrollbar thickness. |
| scrollbarThumbRenderer | TemplateRef<any> \| null = null | Scrollbar customization template. |
| scrollbarThumbParams | {[propName: string]: any;} \| null | Additional options for the scrollbar. |
| scrollBehavior | ScrollBehavior? = 'smooth' | Defines the scrolling behavior for any element on the page. The default value is "smooth". |
| scrollingSettings | [IScrollingSettings](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/interfaces/scrolling-settings.ts) = {frictionalForce: 0.035, mass: 0.005, maxDistance: 100000, maxDuration: 4000, speedScale: 10, breakpointStoppingFactor: 5, optimization: true} | Scrolling settings. |
| scrollingOneByOne | boolean = false | Specifies whether to scroll one item at a time if true and the scrollToItem property is set. The default value is `false`. |
| spreadingMode | [SpreadingMode](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/types/spreading-mode.ts) ='standart' | The order of list elements. Available values ​​are `standard` and `infinity`. `normal` — list elements are ordered according to the collection sequence. `infinity` — list elements are ordered cyclically, forming an infinite list. When set to `infinity`, the `alignment` property is forced to the value `Alignments.CENTER`, the `scrollbarEnabled` property is forced to the `false`. The default value is `standard`. |
| trackBy | string? = 'id' | The name of the property by which tracking is performed. |
| zIndexWhenSelecting | string \| null = null | Defines the zIndex when a list item is selected. The default value is `null`. |

<br/>

Outputs

| Event | Type | Description |
|---|---|---|
| onSnapItem | [Id](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/id.ts) | Emit the component ID when an element crosses the alignment line specified by the snapToItemAlign property. |
| onItemClick | [IRenderVirtualListItem](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/models/render-item.model.ts) \| null | Fires when an element is clicked. |
| onScroll | ([IScrollEvent](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/interfaces/scroll-event.ts)) => void | Fires when the list has been scrolled. |
| onScrollEnd | ([IScrollEvent](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/interfaces/scroll-event.ts)) => void | Fires when the list has completed scrolling. |
| onSelect | Array<[Id](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/id.ts)> \| [Id](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/id.ts) \| null | Fires when an elements are selected. |
| onCollapse | Array<[Id](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/id.ts)> \| [Id](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/id.ts) \| null | Fires when elements are collapsed. |
| onViewportChange | [ISize](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/size.ts) | Fires when the viewport size is changed. |
| onScrollReachStart | void | Fires when the scroll reaches the start. |
| onScrollReachEnd | void | Fires when the scroll reaches the end. |
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
| scrollToStart | (cb: (() => void) \| null = null, options: [IScrollOptions](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/interfaces/scroll-options.ts) \| null = null) | Scrolls the scroll area to the first item in the collection. |
| scrollToEnd | (cb: (() => void) \| null = null, options: [IScrollOptions](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/interfaces/scroll-options.ts) \| null = null) | Scrolls the list to the end of the content height. |
| getItemBounds | (id: [Id](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/id.ts)) => [ISize \| null](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/size.ts) | Returns the bounds of an element with a given id |
| focus | [Id](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/id.ts), align: [FocusAlignment](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/types/focus-alignment.ts) = [FocusAlignments.NONE](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/enums/focus-alignments.ts) | Focus an list item by a given id. |
| preventSnapping | (): void | Prevents the list from snapping to its start or end edge. |
| getDisplayItemPosition | (id: [Id](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/id.ts)): [IPoint](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/point.ts) \| null | Returns the position of a display item with a given id. |

<br/>

### Template API

```html
<ng-template #itemRenderer let-data="data" let-config="config" let-measures="measures" let-api="api">
  <!-- content -->
</ng-template>
```

Properties

| Property | Type | Description |
|--|--|--|
| api | [NtListPublicService](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/nt-list-public.service.ts) | List API Provider. |
| data | {\[id: [Id](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/id.ts) \], [otherProps: string]: any;} | Collection item data. |
| config | [IDisplayObjectConfig](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/models/display-object-config.model.ts) | Display object configuration. A set of `select`, `collapse`, `focus` and `grabbing` properties are also provided. |
| measures | [IDisplayObjectMeasures](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/models/display-object-measures.model.ts) \| null | Display object metrics. |

<br/>

### [NtControlModule](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/directives/nt-control/nt-control.module.ts)

### NtControl directive

To correctly handle interactive elements within a list, such as buttons, you need to use the NtControl directive.

```ts
import { NtListModule, NtControlModule } from 'centrifugal';

@Component({
  selector: 'example',
  imports: [NtListModule, NtControlModule],
})
```

```html
<ng-template #itemRenderer let-data="data" let-config="config" let-api="api">
  @if (data) {
    <div ntControl (onVirtualClick)="api.select(data.id, true)">
      <span>{{data.name}}</span>
    </div>
  }
</ng-template>
```

<br/>
<br/>


### [NtSheetComponent](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/sheet/nt-sheet.component.ts)

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
| animationParams | [IAnimationParams](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/sheet/interfaces/animation-params.ts) = { fadeIn: 500, fadeOut: 500 } | Animation parameters. The default value is "{ fadeIn: 500, fadeOut: 500 }". |
| overscrollEnabled | boolean = true | Determines whether the overscroll (re-scroll) feature will work. The default value is "true". |
| position | [SheetPosition](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/types/sheet-position.ts) = 'bottom' | Determines the position in which elements are placed. Default value is "bottom". |
| langTextDir | [TextDirection](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/text-direction.ts) | A string indicating the direction of text for the locale. Can be either "ltr" (left-to-right) or "rtl" (right-to-left). |
| overscrollAreaShowAutomatically | boolean = true | Sets whether overscroll areas are automatically displayed if the value is true. |
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

<br/>
<br/>


### [NtSliderComponent](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/slider/nt-slider.component.ts)

Inputs

| Property | Type | Description |
|---|---|---|
| direction | [SDirection](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/core/types/s-direction.ts) = "horizontal" | Determines the slider direction. Default value is "horizontal". |
| overscrollEnabled | boolean = false | Determines whether the overscroll (re-scroll) feature will work. The default value is "false". |
| value | number = 0 | Slider value. Default value is `0`. |
| min | number = 0 | Slider min value. Default min value is `0`. |
| max | number | Slider max value. Required. |
| step | number = 0 | Step. Default value is `0`. |
| interactive | boolean = true | Determines whether the slider will respond to user interaction or not. The default value is `true`. |
| scrollStartOffset | [ArithmeticExpression](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/arithmetic-expression.ts) = 0 | Sets the scroll start offset value. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". |
| scrollEndOffset | [ArithmeticExpression](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/arithmetic-expression.ts) = 0 | Sets the scroll end offset value. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". |
| behavior | ScrollBehavior = 'smooth' | Defines the scrolling behavior for any element on the page. The default value is "smooth". |
| motionBlur | number = 5 | Motion blur effect. The default value is `2`. |
| maxMotionBlur | number = 10 | Maximum motion blur effect. The default value is `5`. |
| motionBlurEnabled | boolean = false | Determines whether to apply motion blur or not. The default value is `false`. |
| scrollingSettings | [IScrollingSettings](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/scrolling-settings.ts) = { frictionalForce: 0.035, mass: 0.005, maxDistance: 100000, maxDuration: 4000, speedScale: 10, breakpointStoppingFactor: 10, optimization: false } | Scrolling settings. - frictionalForce - Frictional force. Default value is 0.035. - mass - Mass. Default value is 0.005. - maxDistance - Maximum scrolling distance. Default value is 100000. - maxDuration - Maximum animation duration. Default value is 4000. - speedScale - Speed scale. Default value is 10. - breakpointStoppingFactor - Default value is 10. - optimization - Enables scrolling performance optimization. Default value is `true`. |
| animationParams | [IAnimationParams](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/slider/interfaces/animation-params.ts) = { scroll: 500 } | Animation parameters. The default value is "{ scroll: 500 }". |
| snappingDistance | [SnappingDistance](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/snapping-distance.ts) = '25%' | Snapping activation distance. Can be specified as a percentage of the element size or in absolute values. The default value is `25%`. |
| thumbSize | [ArithmeticExpression](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/arithmetic-expression.ts) = '25%' | Thumb slider size. Can be specified in absolute or percentage values. Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0". Default value is `25%`. | 
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

<br/>
<br/>

### [NtSwitchComponent](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/switch/nt-switch.component.ts)

Inputs

| Property | Type | Description |
|---|---|---|
| value | boolean = false | Switch value. Default value is `false`. |
| direction | [SDirection](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/core/types/s-direction.ts) = "horizontal" | Determines the slider direction. Default value is "horizontal". |
| interactive | boolean = true | Determines whether the slider will respond to user interaction or not. The default value is `true`. |
| contentScale | number = 1.05 | Scale of content. Default value is `1.05`. |
| thumbAnimationDuration | string = "150ms" | Content scale. Default value is `150ms`. |
| langTextDir | [TextDirection](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/text-direction.ts) | A string indicating the direction of text for the locale. Can be either "ltr" (left-to-right) or "rtl" (right-to-left). |

<br/>

Outputs

| Event | Type | Description |
|---|---|---|
| onChange | boolean | Triggers an event when the value changes. |

<br/>
<br/>

## 📄 License

MIT License

Copyright (c) 2026 djonnyx (Evgenii Alexandrovich Grebennikov)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
