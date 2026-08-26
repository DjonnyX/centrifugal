import { Component, input } from "@angular/core";

/**
 * NtDrawerLayoutComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/layouts/nt-drawer-layout/nt-drawer-layout.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
    selector: 'nt-drawer-layout',
    templateUrl: './nt-drawer-layout.component.html',
    styleUrl: './nt-drawer-layout.component.scss',
    host: {
        'style': 'position: relative;'
    },
    standalone: false,
})
export class NtDrawerLayoutComponent {
    dockLeftSize = input<number>(0);
    
    dockTopSize = input<number>(0);
    
    dockRightSize = input<number>(0);
    
    dockBottomSize = input<number>(0);
    
    width = input<number>(0);
    
    height = input<number>(0);
}