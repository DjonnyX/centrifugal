/**
 * INtBaseControlContainerService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/interfaces/nt-base-control-container-service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface INtBaseControlContainerService {
    get id(): number;

    get emitter(): HTMLElement;

    initialize: (id: number, emitter: HTMLElement) => void;
}