import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';

import { AppComponent } from './app/app.component';

if (process.env.ENV === 'production') {
    enableProdMode();
}
bootstrap(AppComponent, [HTTP_PROVIDERS]);
