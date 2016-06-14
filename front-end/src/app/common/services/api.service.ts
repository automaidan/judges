interface ApiInterface {
  fetchListData();
}

const STORAGE_NAME = 'judges_list';

const setToStorage = (storage_name:string, data:any[]) => {
  localStorage.setItem(storage_name, JSON.stringify(data));
};

class Api implements ApiInterface {
  private isFetched:boolean = false;
  private judgesList:any = [];
  private judgesUrl:string;
  private declarationUrl:string;
  private _http:angular.IHttpService;


  /** @ngInject */
  constructor($http:angular.IHttpService, constants:any) {
    this._http = $http;
    this.judgesList = JSON.parse(localStorage.getItem(STORAGE_NAME)) || [];
    this.judgesUrl = constants.fetchListUrl;

  }

  fetchListData() {
    return this._http.get(this.judgesUrl)
      .then((res:any) => {
        if (res.data.length !== this.judgesList.length) {
          this.judgesList = res.data;
          setToStorage(STORAGE_NAME, this.judgesList);
        }

        return this.judgesList;
      });
  }

  getData() {
    if (!this.isFetched) {
      this.isFetched = true;
      return this.fetchListData();
    }
    return new Promise((resolve) => {
      resolve(this.judgesList);
    });
  }

}

export {ApiInterface, Api}
