import { ISize, IDisplayObjectConfig, IVirtualListItem } from "centrifugal";
import { IMessageItemData } from "@shared/models/message";
import { IProxyCollectionItem } from "@widgets/messages/messages/utils/proxy-collection";

export interface IDeleteEventData {
    nativeEvent: Event;
    item: IVirtualListItem<IProxyCollectionItem<IMessageItemData>>;
    config: IDisplayObjectConfig;
    measures: ISize;
}