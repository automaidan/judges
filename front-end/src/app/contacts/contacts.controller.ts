// import * as _ from 'lodash';

export class ContactUs {
    $scope: angular.IScope;
    texts: any;

    private _api: any;
    /* @ngInject */
    constructor($state: any, Api: any, $scope: angular.IScope) {
        console.log('Hello contacts');
        this._api = Api;
        this.texts = {};
        this.$scope = $scope;
        this.getTexts();
    }

    /** @ngInject */
    getTexts() {
        return this._api
            .getTexts()
            .then((res: any) => {
                this.texts.contact_us = res.contact_us;
                this.texts.contact_us_additional = res.contact_us_additional;
                this.$scope.$apply();
            });
    }
}
