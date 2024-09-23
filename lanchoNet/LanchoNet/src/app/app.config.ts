import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  importProvidersFrom,
  LOCALE_ID,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatNativeDateModule} from "@angular/material/core";
import {provideEnvironmentNgxMask} from "ngx-mask";
import {provideHttpClient} from "@angular/common/http";
import {BASE_URL} from "../main";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideEnvironmentNgxMask(),
    { provide: LOCALE_ID, useValue: 'pt-BR' },  // Corrigido o espaço no 'pt-BR'
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    importProvidersFrom(MatNativeDateModule)

  ]// Importando o MatNativeDateModule corretamente]
};
