"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_deprecated_1 = require('@angular/router-deprecated');
var home_component_1 = require('./home/home.component');
var about_component_1 = require('./about/about.component');
var AppComponent = (function () {
    function AppComponent() {
        this.header = "Header";
        this.test = "TEst";
    }
    AppComponent = __decorate([
        router_deprecated_1.RouteConfig([
            {
                path: '/home',
                name: 'Home',
                component: home_component_1.HomeComponent,
                useAsDefault: true
            },
            {
                path: '/about',
                name: 'About',
                component: about_component_1.AboutComponent
            }
        ]),
        core_1.Component({
            selector: 'my-app',
            template: require('./app.view.html'),
            styles: [require('./app.component.css')],
            directives: [router_deprecated_1.ROUTER_DIRECTIVES],
            providers: [
                router_deprecated_1.ROUTER_PROVIDERS
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map