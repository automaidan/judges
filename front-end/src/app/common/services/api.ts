// import * as _ from 'lodash';
import * as _ from 'lodash';

interface IApi {
}

const STORAGES = {
	list: 'JUDGES',
	dictionary: 'DICTIONARY',
	texts: 'TEXTS',
	timestamps: 'TIMESTAMPS'
};

const setToStorage = (storage_name: string, data: any[]) => {
	localStorage.setItem(storage_name, JSON.stringify(data));
};

class Api implements IApi {
	private _allJudges: any;
	private _urls: any;
	private _http: angular.IHttpService;
	private _texts: any;
	private _timestamps: any = {};

	/** @ngInject */
	constructor($http: angular.IHttpService, urls: any) {
		this._http = $http;
		this._allJudges = JSON.parse(localStorage.getItem(STORAGES.list)) || [];
		this._timestamps = JSON.parse(localStorage.getItem(STORAGES.timestamps)) || {};
		this._urls = urls;
		this._texts = null;
		this.fetchTimestamps().then((_timestamps: any) => {
			if (_.isEmpty(this._timestamps)
				|| _timestamps.dictionary !== this._timestamps.dictionary
				|| _timestamps.list !== this._timestamps.list
				|| _timestamps.text !== this._timestamps.text) {
				this._timestamps = angular.copy(_timestamps);
				setToStorage(STORAGES.timestamps, _timestamps);
				this.fetchAll();
			}
		});
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
			this.fetchData(this._urls.listUrl),
			this.fetchData(this._urls.textUrl)
		];

		return Promise.all(promiseArr).then((res: any) => {
			this._toMapData(res[0], res[1]);
			this._texts = res[2];
			setToStorage(STORAGES.list, this._allJudges);
		});
	}

	fetchTimestamps() {
		let promiseArr = [
			this.fetchData(this._urls.dictionaryTimeStamp),
			this.fetchData(this._urls.listTimeStamp),
			this.fetchData(this._urls.textTimeStamp)
		];

		return Promise.all(promiseArr).then((res: any[]) => {
			let _timestamps: any = {};

			_timestamps.dictionary = res[0];
			_timestamps.list = res[1];
			_timestamps.text = res[2];

			return _timestamps;
		});
	}

	getData() {
		return new Promise((resolve: any) => {
			if (!_.isEmpty(this._allJudges)) {
				resolve(this._allJudges);
				return true;
			}
			return this.fetchAll()
				.then(() => {
					resolve(this._allJudges);
				});
		});
	}

	getOne(key: string) {
		return new Promise((resolve: any) => {
			this.fetchData(this._urls.details.replace(':key', key))
				.then((declarations: any) => {
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

	filter(name: string, limit: number = 5) {
		return new Promise((resolve: any, reject: any) => {
			const filteredItems = [],
				regexp = new RegExp(name, 'ig');

			for (let item of this._allJudges) {
				if (filteredItems.length > 5) {
					break;
				}

				regexp.test(item.n) && filteredItems.push(item);
			}
			console.log(name);
			resolve(filteredItems);
		});
	}

}

export { IApi, Api }
