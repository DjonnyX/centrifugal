# Centrifugal

A high-performance web-centric development kit for building mobile-like user interfaces. <br/>

<img width="1033" height="171" alt="logo" src="https://github.com/user-attachments/assets/b559cfde-405a-4361-b71b-6715478d997d" />

<b>Angular version 19-22v.</b>. <br/>
[Documentation](https://centrifugal.eugene-grebennikov.pro/)

<br/>

🌀 A fluid UI. Components interact with each other at a hierarchical level to form a unified system. <br/> <br/>
💥 Visual effects such as motion blur, depth of field, compression/expansion, and more are available, creating a next-generation user interface. <br/> <br/>
🛠️ Fast, customizable and developer-friendly. <br/> <br/>
⚡ A powerful API for implementing components of varying functionality and complexity. <br/> <br/>
💻 Works correctly in all browsers and platforms. <br/> <br/>
💪 The software portion of the project was completed without a single line of code written using artificial intelligence! <br/>

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
    <div class="scroll-view__content" [style.width.px]="3000" [style.height.px]="3000" [class.grabbing]="scrollView.$grabbing | async"></div>
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

- [NtControlContainer](https://github.com/DjonnyX/centrifugal/blob/main/api/API_NT_CONTROL_CONTAINER.md)
- [NtControl](https://github.com/DjonnyX/centrifugal/blob/main/api/API_NT_CONTROL.md)
- [NtDrawer](https://github.com/DjonnyX/centrifugal/blob/main/api/API_NT_DRAWER.md)
- [NtList](https://github.com/DjonnyX/centrifugal/blob/main/api/API_NT_LIST.md)
- [NtScrollView](https://github.com/DjonnyX/centrifugal/blob/main/api/API_NT_SCROLL_VIEW.md)
- [NtSheet](https://github.com/DjonnyX/centrifugal/blob/main/api/API_NT_SHEET.md)
- [NtSlider](https://github.com/DjonnyX/centrifugal/blob/main/api/API_NT_SLIDER.md)
- [NtSwitch](https://github.com/DjonnyX/centrifugal/blob/main/api/API_NT_SWITCH_.md)

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
