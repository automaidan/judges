// import * as _ from 'lodash';
import * as _ from 'lodash';

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
		this._texts = JSON.parse(localStorage.getItem(STORAGES.texts));
		this._urls = urls;
		this.fetchAll();
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
			if (!_.isEmpty(this._allJudges)) {
				resolve(this._allJudges);
				return true;
			}
			return this.fetchAll()
				.then((res: any) => {
					this._toMapData(res[0], res[1]);
					setToStorage(STORAGES.list, this._allJudges);

					resolve(this._allJudges);
				});
		});
	}

	getOne(key: string) {
		return new Promise((resolve: any) => {
			this.fetchData(this._urls.details.replace(':key', key))
				.then((declarations: any) => {
					console.log(declarations);
					resolve(declarations);
				});
		});
	}

	getTexts() {
		return new Promise((resolve: any, reject: any) => {
			if (this._texts) {
				resolve(this._texts);
				return true;
			}
			return this.fetchData(this._urls.textUrl)
				.then((res: any) => {
					setToStorage(STORAGES.texts, res);
					resolve(res);
				})
				.catch((e: any) => {
					reject(e);
				});
		});
	}

	_toMapData(dictionary: any, allJudges: any) {
		this._allJudges = _.sortBy(allJudges.map((item: any) => {
			for (let key in item) {
				if (key !== 'k' && key !== 'n') {
					item[key] = dictionary[item[key]];
				}
			}
			return item;
		}), ['k']);

		return this._allJudges;
	}
}

export { IApi, Api }
