import { Component } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';

import './rxjs-operators';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { DetailsComponent } from './details/details.component';
import { NavbarComponent } from './common/components/navbar/navbar.component';
import config from './common/constants/app.config';

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
    },
    {
        path: '/details/:id',
        name: 'Details',
        component: DetailsComponent
    }
])


@Component({
    selector: 'my-app',
    template: require('./app.view.html'),
    styles: [require('./app.component.css')],
    directives: [ROUTER_DIRECTIVES, NavbarComponent],
    providers: [
        ROUTER_PROVIDERS
    ]
})

export class AppComponent {
    header: string = "Header";
    menuItems: any[] = config.menuItems;
    constructor () {}
}
