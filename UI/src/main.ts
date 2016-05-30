import { bootstrap }    from '@angular/platform-browser-dynamic';
import { AppComponent } from './app/app.components.ts';

bootstrap(AppComponent)
    .catch(err => console.log(err));