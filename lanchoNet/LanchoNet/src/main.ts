import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {destroyPlatform, getPlatform, InjectionToken} from '@angular/core';

export const BASE_URL = new InjectionToken<string>('BASE_URL');
if (getPlatform()) {
  destroyPlatform();
}
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
