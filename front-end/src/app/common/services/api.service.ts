interface ApiInterface {
  fetchListData()
}

class Api implements ApiInterface {
  private judgesList:any = [];
  private judgesUrl:string;
  private declarationUrl:string;
  private _http:angular.IHttpService;


  /** @ngInject */
  constructor($http:angular.IHttpService, constants:any) {
    this._http = $http;
    this.judgesUrl = constants.fetchListUrl;

  }

  fetchListData() {
    return this._http.get(this.judgesUrl)
      .then(res => {
        this.judgesList = res.data;
        return this.judgesList;
      })
  }

  getData() {
    if(this.judgesList.length === 0) {
      debugger;
      return this.fetchListData();
    }
    return this.judgesList;
  }
}

export { ApiInterface, Api }
