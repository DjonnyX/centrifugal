import { debounce, Id } from 'centrifugal';
import { EventEmitter } from "@shared/utils/event-emitter";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export type CollectionItem<D = any> = { id: Id; } & D;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IProxyCollectionItem<D = any> {
    id: Id;
    data: CollectionItem<D>;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
const createProxyItem = <D = any>(data: CollectionItem<D>,
    params: Partial<Omit<IProxyCollectionItem<D>, 'id' | 'data'>> = {}):
    CollectionItem<IProxyCollectionItem<D>> => ({
        ...params,
        id: data.id,
        data,
    });

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
const sortByPageNum = (a: IProxyCollectionItem<any>, b: IProxyCollectionItem<any>) => {
    if (a.data.pageNum > b.data.pageNum) {
        return 1;
    }
    if (a.data.pageNum < b.data.pageNum) {
        return -1;
    }
    return 0;
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

    protected _dictIndexes: { [id: Id]: number } = {};

    protected _collection = new Array<CollectionItem<IProxyCollectionItem<D>>>();
    get collection() { return this._collection; }

    private _fireChangeHandler = () => {
        this.dispatch(ProxyCollectionEvents.CHANGE);
    }

    private _fireChangeDebounces = debounce(this._fireChangeHandler, 0);

    constructor(from: Array<CollectionItem<D>>) {
        super();
        this.from(from);
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
            const index = this._dictIndexes[id];
            if (index > -1) {
                collection[index] = { ...collection[index], ...(params ?? {}) };
                dict[id] = collection[index];
            }
        } else {
            const proxyItem = createProxyItem(data, params);
            collection.push(proxyItem);
            dict[id] = proxyItem;
        }

        this._collection = collection.sort(sortByPageNum);

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
        }

        const dict = append ? this._dict : {}, collection = append ? this._collection : [];

        for (let i = 0, l = src.length; i < l; i++) {
            const item = src[i], id = item.id, dictItem = dict[id];
            if (dictItem) {
                dict[id].data = { ...dict[id].data, ...item };
            } else {
                const proxyItem = createProxyItem(item);
                collection.push(proxyItem);
                dict[id] = proxyItem;
            }
        }

        this._dict = dict;

        this._collection = collection.sort(sortByPageNum);

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