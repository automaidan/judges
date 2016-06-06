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
/**
 * HOME PAGE
 *
 * **/
var core_1 = require('@angular/core');
var datatable_1 = require('angular2-datatable/datatable');
var api_service_1 = require('../common/services/api.service');
var HomeComponent = (function () {
    function HomeComponent(api) {
        this.api = api;
        this.regions = [];
    }
    HomeComponent.prototype.ngOnInit = function () { this.getRegions(); };
    HomeComponent.prototype.getRegions = function () {
        var _this = this;
        this.api.getRegions()
            .then(function (regions) {
            _this.regions = regions;
        }, function (err) {
        });
    };
    __decorate([
        core_1.Input('header'), 
        __metadata('design:type', String)
    ], HomeComponent.prototype, "header", void 0);
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'home-layout',
            template: require('./home.view.html'),
            styles: [require('./home.css')],
            providers: [api_service_1.Api],
            directives: [datatable_1.DataTableDirectives]
        }), 
        __metadata('design:paramtypes', [api_service_1.Api])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map