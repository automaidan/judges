// import * as _ from 'lodash';

interface IApi {
  // fetchDictionary(): Promise<any>;
  // fetchListData(): Promise<any>;
  // fetchAll(): Promise<any>;
  // toMapData(cont: number): void;
  // getData(): Promise<any>;
}

const LIST_STORAGE = 'list';
const DICTIONARY_STORAGE = 'judges_dictionary';

const setToStorage = (storage_name: string, data: any[]) => {
  localStorage.setItem(storage_name, JSON.stringify(data));
};

class Api implements IApi {
  private _allJudges: any;
  private _dictionary: string;
  private _urls: any;
  private _http: angular.IHttpService;

  /** @ngInject */
  constructor($http: angular.IHttpService, urls: any) {

    this._http = $http;
    this._allJudges = JSON.parse(localStorage.getItem(LIST_STORAGE)) || [];
    this._dictionary = JSON.parse(localStorage.getItem(DICTIONARY_STORAGE));
    this._urls = urls;
    debugger;

  }

  fetchData(url) {
    return this._http.get(url)
      .then((res: any) => {
        return res.data;
      })
      .catch((e: any) => {
        throw new Error(e);
      });

  }

  fetchAll() {
    let promiseArr = [
      this.fetchData(this._urls.dictionaryUrl),
      this.fetchData(this._urls.listUrl)
    ];

    return Promise.all(promiseArr);
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
      debugger;
      if (this._allJudges.length !== 0
        && angular.isDefined(this._dictionary)) {
        debugger;
        resolve([this._dictionary, this._allJudges]);
      }
      this.fetchAll()
        .then((res: any) => {
          setToStorage(DICTIONARY_STORAGE, res[0]);
          setToStorage(LIST_STORAGE, res[1]);
          this._dictionary = res[0];
          this._allJudges = res[1];
          debugger;
          resolve([this._dictionary, this._allJudges]);
        })

    })
  }

  getOne(key) {
    return new Promise((resolve: any) => {
      this.fetchData(this._urls.details.replace(':key', key))
        .then((data: any) => {
          debugger;
          resolve(data);
        })
    })
  }

}

export { IApi, Api }
