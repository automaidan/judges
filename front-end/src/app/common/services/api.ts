// import * as _ from 'lodash';

interface IApi {
  // fetchDictionary(): Promise<any>;
  // fetchListData(): Promise<any>;
  // fetchAll(): Promise<any>;
  // toMapData(cont: number): void;
  // getData(): Promise<any>;
}


const STORAGES = {
  list: 'LIST',
  dictionary: 'DICTIONARY',
  texts: 'TEXTS'
};


const setToStorage = (storage_name: string, data: any[]) => {
  localStorage.setItem(storage_name, JSON.stringify(data));
};

class Api implements IApi {
  private _allJudges: any;
  private _dictionary: string;
  private _urls: any;
  private _http: angular.IHttpService;
  private _texts: any;

  /** @ngInject */
  constructor($http: angular.IHttpService, urls: any) {
    this._http = $http;
    this._allJudges = JSON.parse(localStorage.getItem(STORAGES.list)) || [];
    this._dictionary = JSON.parse(localStorage.getItem(STORAGES.dictionary));
    this._texts = JSON.parse(localStorage.getItem(STORAGES.texts));
    this._urls = urls;
  }

  fetchData(url: string) {
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

  getData() {
    return new Promise((resolve: any) => {
      if (this._allJudges.length !== 0
        && angular.isDefined(this._dictionary)) {
        resolve(this._toMapData());
      }
      this.fetchAll()
        .then((res: any) => {
          setToStorage(STORAGES.dictionary, res[0]);
          setToStorage(STORAGES.list, res[1]);

          this._dictionary = res[0];
          this._allJudges = res[1];

          resolve(this._toMapData());
        });
    });
  }

  getOne(key: string) {
    return new Promise((resolve: any) => {
      this.fetchData(this._urls.details.replace(':key', key))
        .then((data: any) => {
          resolve(data);
        });
    });
  }

  getTexts() {
    return new Promise((resolve: any, reject: any) => {
      if (this._texts) {
        resolve(this._texts);
      }
      this.fetchData(this._urls.textUrl)
        .then((res: any) => {
          setToStorage(STORAGES.texts, res);
          resolve(res);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

	_toMapData() {
		return this._allJudges.map((item: any) => {
			for (let key in item) {
				if (key !== 'k' && key !== 'n') {
					item[key] = this._dictionary[item[key]];
				}
			}
			return item;
		});
	}
}

export { IApi, Api }
