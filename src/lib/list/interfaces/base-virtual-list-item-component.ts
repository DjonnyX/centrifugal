import { TemplateRef } from '@angular/core';
import { IRenderVirtualListItem } from '../models/render-item.model';
import { Id, ISize } from '../../common';

/**
 * INtBaseVirtualListItemComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/interfaces/base-virtual-list-item-component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface INtBaseVirtualListItemComponent {
    get id(): number;
    regular: boolean;
    set regularLength(v: string)
    set item(v: IRenderVirtualListItem | null | undefined);
    get item(): IRenderVirtualListItem | null | undefined;
    get itemId(): Id | undefined;
    set renderer(v: TemplateRef<any> | undefined);
    get element(): HTMLElement;
    getBounds(): ISize;
    show(): void;
    hide(): void;
}