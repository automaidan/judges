export class DetailsController {
  declarations: any[];
  $scope: angular.IScope;
  detail_info: any;
  data: any;
  renderedData: any;
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
      this.data.dc = data.dc;
      this.$scope.$apply();
    });
  }
  filterData(key) {
    debugger;
    let renderedData =  this.data.declarations.map((item) => {
      let filteredData = {};
      filteredData[key] = angular.copy(item[key]);
      return filteredData;
    });
    debugger;
    this.toRenderData(key);
  }
  toRenderData(renderData: any) {
    console.log("In controller!!");
    this.renderedData = renderData;
  }
}
