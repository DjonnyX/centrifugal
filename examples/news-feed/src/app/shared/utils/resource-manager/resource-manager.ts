import { CMap } from "../cmap";
import { EventEmitter } from "../event-emitter";
import { Thread, ThreadManager } from "../thread-manager";

const IMAGE_PATTERN = 'data:image/',
    NOT_RESOURCE = 'not:resource';

export enum ResourceStatus {
    NOT_ADDED,
    WAITING,
    LOADING,
    LOADED,
    REJECTED,
    ERROR,
}

export enum ResourceManagerEvents {
    PROGRESS = 'progress',
}

const MAX_CONTENT_LIMIT = 1000000;

type ResourceManagerProgressListener = (url: string) => void;

type ResourceManagerListeners = ResourceManagerProgressListener;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
class ResourceManager extends EventEmitter<ResourceManagerEvents, ResourceManagerListeners> {
    private static _instance: ResourceManager;

    private _threadManager = new ThreadManager({
        maxThreads: 4,
    });

    private _map = new CMap<string, string>();

    private _statusMap = new CMap<string, ResourceStatus>();

    constructor() {
        super();
        if (ResourceManager._instance) {
            throw Error('ResourceManager already initialized.');
        }
        ResourceManager._instance = this;

        this._threadManager.run();
    }

    add(url: string) {
        const status = this._statusMap.get(url);
        if (status === ResourceStatus.LOADING || status === ResourceStatus.LOADED || status === ResourceStatus.REJECTED) {
            return;
        }
        this._statusMap.set(url, ResourceStatus.WAITING);
        const thread = new Thread({
            onStart: async () => {
                this._statusMap.set(url, ResourceStatus.LOADING);
                const resource = await (new Promise<string | undefined>((resolve) => {
                    try {
                        fetch(url, {
                            cache: 'no-cache',
                            priority: 'auto',
                            mode: 'cors',
                        }).then(res => {
                            if (!res.ok) {
                                throw Error('Loading error');
                            }
                            return res.blob();
                        }).then(imgBlob => {
                            try {
                                const fileReader = new FileReader();
                                fileReader.onprogress = (e: ProgressEvent<FileReader>) => {
                                    if (e.loaded >= MAX_CONTENT_LIMIT) {
                                        fileReader.abort();
                                    }
                                };
                                fileReader.onload = () => { resolve(fileReader.result?.toString()); };
                                fileReader.onerror = () => { resolve(undefined); };
                                fileReader.readAsDataURL(imgBlob);
                            } catch (err) {
                                resolve(undefined);
                            }
                        }).catch(err => {
                            resolve(NOT_RESOURCE);
                        });
                    } catch (e) {
                        resolve(NOT_RESOURCE);
                    }
                }));

                if (resource !== undefined) {
                    if (resource.indexOf(IMAGE_PATTERN) === 0) {
                        this._map.set(url, resource);
                        this._statusMap.set(url, ResourceStatus.LOADED);
                        thread.complete();
                        this.dispatch(ResourceManagerEvents.PROGRESS, url);
                        return;
                    } else {
                        this._map.set(url, url);
                        this._statusMap.set(url, ResourceStatus.REJECTED);
                        thread.complete();
                        this.dispatch(ResourceManagerEvents.PROGRESS, url);
                        return;
                    }
                }

                this._statusMap.set(url, ResourceStatus.ERROR);
                thread.reject();
            },
        });
        this._threadManager.add(thread);
        this._threadManager.play();
    }

    getStatus(url: string): ResourceStatus {
        const status = this._statusMap.get(url);
        if (status !== undefined) {
            return status;
        }
        return ResourceStatus.NOT_ADDED;
    }

    has(url: string) {
        return this._map.has(url);
    }

    get(url: string) {
        return this._map.get(url);
    }

    clear() {
        this._statusMap.clear();
        return this._map.clear();
    }
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export const resourceManager = new ResourceManager();
