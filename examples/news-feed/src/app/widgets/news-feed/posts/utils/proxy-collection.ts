import { debounce, Id } from 'centrifugal';
import { EventEmitter } from "@shared/utils/event-emitter";
import { MessageTypes } from "@shared/enums";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export type CollectionItem<D = any> = { id: Id, quoteId?: Id, dateTime: number, version: number, __deleted__?: boolean, type?: MessageTypes; } & D;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IProxyCollectionItem<D = any> {
    id: Id;
    quote?: IProxyCollectionItem<D>;
    new: boolean;
    type: MessageTypes | undefined;
    version: number;
    edited: boolean;
    selected: boolean;
    animate: boolean;
    deleting: boolean;
    deleted: boolean;
    removal: boolean;
    processing: boolean;
    tmpText: string | undefined;
    data: CollectionItem<D>;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
const createProxyItem = <D = any>(data: CollectionItem<D>,
    params: Partial<Omit<IProxyCollectionItem<D>, 'id' | 'data'>> = {}):
    CollectionItem<IProxyCollectionItem<D>> => ({
        version: -1,
        new: true,
        type: data.type,
        edited: false,
        selected: false,
        animate: false,
        deleting: false,
        deleted: false,
        removal: false,
        processing: false,
        tmpText: undefined,
        ...params,
        id: data.id,
        dateTime: data.dateTime,
        data,
    });

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
const sortByDateTime = (a: IProxyCollectionItem<any>, b: IProxyCollectionItem<any>) => {
    if (a.data.dateTime > b.data.dateTime) {
        return 1;
    }
    if (a.data.dateTime < b.data.dateTime) {
        return -1;
    }
    return (a.data.type === MessageTypes.GROUP && b.data.type !== MessageTypes.GROUP) ? -1 : 0;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export enum ProxyCollectionEvents {
    CHANGE = 'change',
};

type TProxyCollectionEvents = ProxyCollectionEvents.CHANGE;

type TProxyCollectionChangeHandler = () => void;

type TProxyCollectionEventHandlers = TProxyCollectionChangeHandler;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export class ProxyCollection<D = any> extends EventEmitter<TProxyCollectionEvents, TProxyCollectionEventHandlers> {
    protected _dict: { [id: Id]: CollectionItem<IProxyCollectionItem<D>> } = {};

    protected _unmailedDict: { [id: Id]: CollectionItem<IProxyCollectionItem<D>> } = {};

    protected _dictIndexes: { [id: Id]: number } = {};

    protected _collection = new Array<CollectionItem<IProxyCollectionItem<D>>>();
    get collection() { return this._collection; }

    get unmailedItem() {
        const unmailed = Object.values(this._unmailedDict).sort(sortByDateTime);
        return unmailed.length > 0 ? unmailed[0] : undefined;
    }

    private _unmailed: CollectionItem<IProxyCollectionItem<D>> | undefined;
    get unmailed() { return this._unmailed; }

    private _fireChangeHandler = () => {
        this.dispatch(ProxyCollectionEvents.CHANGE);
    }

    private _fireChangeDebounces = debounce(this._fireChangeHandler, 0);

    constructor(from: Array<CollectionItem<D>>) {
        super();
        this.from(from);
    }

    isUnmailed(id: Id) {
        return !!this._unmailedDict[id];
    }

    get(id: Id) {
        return this._dict[id] ?? null;
    }

    has(id: Id) {
        return (this._dict[id] ?? null) !== null;
    }

    set(id: Id, data: CollectionItem<D>, params?: Partial<Omit<IProxyCollectionItem<D>, 'id' | 'data'>>) {
        const dict = this._dict, collection = this._collection, item = dict[id];
        if (item) {
            item.data = { ...item.data, ...data };
            item.type = (data as any)?.['data']?.type;
            const t = (item.data as any)?.type;
            if (t === MessageTypes.POST) {
                if ((item.data as any)?.['data']?.mailed) {
                    if (this._unmailedDict[id]) {
                        delete this._unmailedDict[id];
                    }
                } else if ((item.data as any)?.['data']) {
                    if (!this._unmailedDict[id]) {
                        this._unmailedDict[id] = item;
                    }
                }
            }
            const index = this._dictIndexes[id];
            if (index > -1) {
                collection[index] = { ...collection[index], ...(params ?? {}) };
                dict[id] = collection[index];
            }
        } else {
            const proxyItem = createProxyItem(data, params);
            collection.push(proxyItem);
            dict[id] = proxyItem;
            const t = (dict[id] as any)?.type;
            if (t === MessageTypes.POST) {
                if ((dict[id] as any)?.['data']?.mailed) {
                    if (this._unmailedDict[id]) {
                        delete this._unmailedDict[id];
                    }
                } else if ((dict[id] as any)?.['data']) {
                    if (!this._unmailedDict[id]) {
                        this._unmailedDict[id] = proxyItem;
                    }
                }
            }
        }

        this._collection = collection.sort(sortByDateTime);

        this.resetIndexes();

        this.fireChange();

        return this._collection;
    }

    setParams(id: Id, params?: Partial<Omit<IProxyCollectionItem<D>, 'id' | 'data'>>) {
        const dict = this._dict, collection = this._collection, item = dict[id];
        if (item) {
            if (params) {
                const index = this._dictIndexes[id];
                if (index > -1) {
                    collection[index] = { ...collection[index], ...params };
                    dict[id] = collection[index];
                }

                if (params.hasOwnProperty('type')) {
                    item.type = params.type;
                }
            }
        }

        this.resetIndexes();

        this.fireChange();

        return this._collection;
    }

    delete(id: Id) {
        const index = this._dictIndexes[id];
        if (index > -1) {
            this._collection.splice(index, 1);
            if (this._unmailed?.id === id) {
                this._unmailed = undefined;
            }
            if (this._unmailedDict[id]) {
                delete this._unmailedDict[id];
            }
            delete this._dict[id];

            this.resetIndexes();
        }

        this.fireChange();

        return this._collection;
    }

    from(src: Array<CollectionItem<D>>, append: boolean = false) {
        if ((!src || src.length === 0) && !append) {
            this._dictIndexes = {};
            this._dict = {};
            this._unmailedDict = {};
        }

        const dict = append ? this._dict : {}, unmailedDict = append ? this._unmailedDict : {}, collection = append ? this._collection : [];

        for (let i = 0, l = src.length; i < l; i++) {
            const item = src[i], id = item.id, dictItem = dict[id];
            if (dictItem) {
                if ((dictItem.version === undefined && item.version === 0) ||
                    (dictItem.version < item.version) ||
                    (dictItem.version === Number.MAX_SAFE_INTEGER && item.version === 0)) {
                    if (item.__deleted__) {
                        const index = this._dictIndexes[id];
                        if (index > -1) {
                            this._collection.splice(index, 1);
                            delete this._dict[id];
                        }
                    } else {
                        dict[id].data = { ...dict[id].data, ...item };
                        dict[id].type = dict[id].data.type;
                        dict[id].version = item.version;
                        dict[id].dateTime = item.dateTime;

                        const t = (dict[id] as any)?.type;
                        if (t === MessageTypes.POST) {
                            if ((dict[id] as any)?.['data'].mailed) {
                                if (unmailedDict[id]) {
                                    delete unmailedDict[id];
                                }
                            } else if ((dict[id] as any)?.['data']) {
                                if (!unmailedDict[id]) {
                                    unmailedDict[id] = dict[id];
                                }
                            }
                        }
                    }
                }
            } else {
                if (item.__deleted__) {
                    const index = this._dictIndexes[id];
                    if (index > -1) {
                        this._collection.splice(index, 1);
                        if (unmailedDict[id]) {
                            delete unmailedDict[id];
                        }
                        delete this._dict[id];
                    }
                } else {
                    const proxyItem = createProxyItem(item);
                    collection.push(proxyItem);
                    dict[id] = proxyItem;

                    const t = (dict[id] as any)?.type;
                    if (t === MessageTypes.POST) {
                        if ((dict[id] as any)?.['data'].mailed) {
                            if (unmailedDict[id]) {
                                delete unmailedDict[id];
                            }
                        } else if ((dict[id] as any)?.['data']) {
                            if (!unmailedDict[id]) {
                                unmailedDict[id] = dict[id];
                            }
                        }
                    }
                }
            }
        }

        this._dict = dict;

        this._unmailedDict = unmailedDict;

        this._collection = collection.sort(sortByDateTime);

        this.resetIndexes();

        this.fireChange();

        return this._collection;
    }

    private fireChange() {
        this._fireChangeDebounces.execute();
    }

    private resetIndexes() {
        const collection = this._collection, indexes: { [id: Id]: number } = {};
        for (let i = 0, l = collection.length; i < l; i++) {
            const item = collection[i], id = item.id;
            indexes[id] = i;
        }
        this._dictIndexes = indexes
    }

    toObject() {
        return [...this._collection];
    }
}