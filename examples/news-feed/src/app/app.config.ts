import { ApplicationConfig, EnvironmentProviders, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { environment } from '@environments/environment';
import { MEDIA_CONFIG } from '@shared/directives/media';
import { routes } from './app.routes';
import { mediaConfig } from './media.config';

let routerProvider: EnvironmentProviders;
if (environment.useMock) {
  routerProvider = provideRouter(routes, withHashLocation());
} else {
  routerProvider = provideRouter(routes);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    routerProvider,
    {
      provide: MEDIA_CONFIG, useValue: mediaConfig,
    }
  ],
};
