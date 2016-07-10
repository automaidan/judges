export class DetailsController {
  declarations: any[];
  $scope: angular.IScope;
  detail_info: any;
  data: any;
  private _api: any;
  /* @ngInject */
  constructor($state: any, Api: any, $scope: angular.IScope) {
    console.log('Helo details');
    this._api = Api;
    this.getDetails($state.params.key);
    this.$scope = $scope;
  }

  /** @ngInject */
  getDetails(key: string) {
    return this._api.getOne(key).then((data: any) => {
      this.data = data;
      this.declarations = data.dc;
      this.$scope.$apply();
    });
  }
}
