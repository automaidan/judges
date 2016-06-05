import { Component } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

@RouteConfig([
    {
        path: '/home',
        name: 'Home',
        component: HomeComponent,
        useAsDefault: true
    },
    {
        path: '/about',
        name: 'About',
        component: AboutComponent
    }
])


@Component({
    selector: 'my-app',
    template: require('./app.view.html'),
    styles: [require('./app.component.css')],
    directives: [ROUTER_DIRECTIVES],
    providers: [
        ROUTER_PROVIDERS
    ]
})

export class AppComponent {
    header: string = "Header";
    test: string = "TEst";
}