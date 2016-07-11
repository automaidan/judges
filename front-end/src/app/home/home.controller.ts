
/** @ngInject */
interface IHomeController {
  texts: any;
  _api: any;
  getTexts(): Promise<any>;
}

export class HomeController implements IHomeController {

  texts: any;
  _api: any;
  /* @ngInject */
  constructor(Api: any, $scope: angular.IScope) {
    console.log('Helo home');
    this._api = Api;
    this.getTexts().then((res: any) => {
      this.texts = res.home_page;
      $scope.$apply();
    });

  }

  /** @ngInject */
  getTexts() {
    return this._api.getTexts()

  }
}
