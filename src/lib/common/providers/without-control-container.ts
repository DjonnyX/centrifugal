import { Provider } from "@angular/core";
import { CONTROL_CONTAINER_SERVICE } from "../injection";

export const ntWithoutControlContainer = (): Provider => ({
    provide: CONTROL_CONTAINER_SERVICE, useValue: null,
});
