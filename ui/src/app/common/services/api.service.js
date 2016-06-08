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
 * Created by IlyaLitvinov on 05.06.16.
 */
/**
 * Judges service
 *
 **/
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Api = (function () {
    function Api(http) {
        this.http = http;
        this.allJudgesUrl = '/source/all-ukraine-judges-csv-links.json'; // URL to web API
    }
    Api.prototype.extractData = function (response) {
        return response.json() || {};
    };
    Api.prototype.getRegions = function () {
        return this.http.get(this.allJudgesUrl)
            .toPromise()
            .then(this.extractData)
            .catch(function (error) {
        });
    };
    Api = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], Api);
    return Api;
}());
exports.Api = Api;
//# sourceMappingURL=api.service.js.map