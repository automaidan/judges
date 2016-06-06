/**
 * Navbar component
 *
 * **/
import { Component, Input } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';

import config from '../../constants/app.config';


@Component({
    selector: 'navbar',
    template: require('./navbar.view.html'),
    styles: [require('./navbar.css')],
    directives: [ROUTER_DIRECTIVES],
    providers: [
        ROUTER_PROVIDERS
    ]
})


export class NavbarComponent {
    menuItems: any[];

    constructor () {
        this.menuItems = config.menuItems;
    }


}
