/**
 * IControlContainerService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/interfaces/control-container-service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IControlContainerService {
    get id(): number;

    get preventControlEvents(): boolean;

    get emitter(): HTMLElement;

    initialize: (id: number, emitter: HTMLElement) => void;
}