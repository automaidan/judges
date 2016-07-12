interface IAboutController {
  aboutText: string;
  getData(): Promise<any>;
}

class AboutController implements IAboutController {
  aboutText: any;
  aboutTitleAdditional: any;
  aboutAdditional: any;
  $scope: any;

  private _api: any;
  /* @ngInject */


  constructor(Api: any, $scope: angular.IScope) {
    console.log('Hello About');
    this._api = Api;
    this.$scope = $scope;
    this.getData();
  }

  /** @ngInject */
  getData() {
    return this._api.getTexts().then((res: any) => {
      this.aboutText = res.about_project;
      this.aboutTitleAdditional = res.about_project_title_additional;
      this.aboutAdditional = res.about_project_text_additional;
      this.$scope.$apply();
    });
  }
}

export { AboutController };
