// import * as _ from 'lodash';

interface IApi {
  // fetchDictionary(): Promise<any>;
  // fetchListData(): Promise<any>;
  // fetchAll(): Promise<any>;
  // toMapData(cont: number): void;
  // getData(): Promise<any>;
}

const STORAGE_NAME = 'judges_list';
const DICTIONARY_STORAGE_NAME = 'judges_dictionary';

const setToStorage = (storage_name: string, data: any[]) => {
  localStorage.setItem(storage_name, JSON.stringify(data));
};

class Api implements IApi {
  private _allJudges: any = [];
  private _dictionary: string;
  private _urls: any;
  private _http: angular.IHttpService;

  /** @ngInject */
  constructor($http: angular.IHttpService, urls: any) {

    this._http = $http;
    this._allJudges = JSON.parse(localStorage.getItem(STORAGE_NAME)) || [];
    this._urls = urls;

  }

  fetchDictionary() {
    return this._http.get(this._urls.dictionaryUrl)
      .then((res: any) => {
        return res.data;
      });

  }

  fetchListData() {
    return this._http.get(this._urls.listUrl)
      .then((res: any) => {
        return Array.prototype.slice.call(res.data);
      });
  }

  fetchAll() {
    return Promise.all([this.fetchDictionary(), this.fetchListData()])
  }

  getPartialList(count) {
    return this.toMapData(count);
  }

  toMapData(count) {
    return new Promise((resolve, reject) => {
      this._allJudges.splice(0, count)
        .forEach(item => {
          console.log(item);
        });

    });
  }

  getData() {
    return new Promise((resolve: any) => {
      return this.fetchAll()
        .then((res: any) => {
          this._dictionary = res[0];
          this._allJudges = res[1];
          debugger;
          resolve([this._dictionary, this._allJudges]);
        })

    })
  }

}

export { IApi, Api }
