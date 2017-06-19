/** @ngInject */
interface IHomeController {
    texts: any;
    _api: any;
    getTexts(): Promise<any>;
}

export class HomeController implements IHomeController {
    texts: any;
    _api: any;
    isOpen: boolean = false;

    /* @ngInject */
    constructor(Api: any, $scope: angular.IScope) {
        this._api = Api;
        this.getTexts().then((res: any) => {
            this.texts = res;
            $scope.$apply();
        });

    }

    /** @ngInject */
    getTexts() {
        return this._api.getTexts();
    }
}
