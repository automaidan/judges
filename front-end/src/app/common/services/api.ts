// import * as _ from 'lodash';
import * as _ from 'lodash';
import { IDropDownOption } from '../interfaces'
import { IDropDownList } from '../interfaces'

interface IApi {
}

const STORAGES = {
	list: 'JUDGES',
	dictionary: 'DICTIONARY',
	texts: 'TEXTS',
	timestamps: 'TIMESTAMPS',
	regions: 'REGIONS',
	departments: 'DEPARTMENTS'
};

const setToStorage = (storage_name: string, data: any[]) => {
	localStorage.setItem(storage_name, JSON.stringify(data));
};

const separateOptions = (data: any[], key: string) => {
	return data.reduce((reduced, item)=> {
		const region: IDropDownOption = {
			title: item[key],
			key: item[key]
		};

		if (!_.find(reduced, region)) {
			reduced.push(region);
		}
		return reduced;
	}, []);
};

const getAllRegions = (data: any[]) => {
	const allRegions = separateOptions(data, 'r');

	allRegions.unshift({
		title: 'Всі регіони',
		key: ''
	});

	return allRegions;
};

const getAllDepartments = (data: any[]) => {
	const allDepartmets = separateOptions(data, 'd');

	allDepartmets.unshift({
		title: 'Всі департаменти',
		key: ''
	});
	console.log(allDepartmets);
	return allDepartmets
};

class Api implements IApi {
	private _allJudges: any;
	private _urls: any;
	private _http: angular.IHttpService;
	private _texts: any;
	private _timestamps: any = {};
	private _allRegions: IDropDownList;
	private _allDepartments: IDropDownList;

	/** @ngInject */
	constructor($http: angular.IHttpService, urls: any) {
		this._http = $http;
		this._allJudges = JSON.parse(localStorage.getItem(STORAGES.list)) || [];
		this._allRegions = JSON.parse(localStorage.getItem(STORAGES.regions)) || [];
		this._timestamps = JSON.parse(localStorage.getItem(STORAGES.timestamps)) || {};
		this._allDepartments = JSON.parse(localStorage.getItem(STORAGES.departments)) || {};
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

	private fetchData(url: string) {
		return this._http.get(url)
			.then((res: any) => {
				return res.data;
			})
			.catch((e: any) => {
				throw new Error(e);
			});

	}

	private fetchAll() {
		let promiseArr = [
			this.fetchData(this._urls.dictionaryUrl),
			this.fetchData(this._urls.listUrl),
			this.fetchData(this._urls.textUrl)
		];

		return Promise.all(promiseArr).then((res: any) => {
			this._toMapData(res[0], res[1]);

			this._texts = res[2];
			this._allRegions = getAllRegions(this._allJudges);
			this._allDepartments = getAllDepartments(this._allJudges);

			setToStorage(STORAGES.regions, this._allRegions);
			setToStorage(STORAGES.departments, this._allDepartments);
			setToStorage(STORAGES.list, this._allJudges);
		});
	}

	private fetchTimestamps() {
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



	private _toMapData(dictionary: any, allJudges: any) {
		this._allJudges = _.sortBy(allJudges.map((item: any) => {
			for (let key in item) {
				if (item.hasOwnProperty(key) && key !== 'k' && key !== 'n' && key !== 'a') {
					item[key] = dictionary[item[key]];
				}
			}
			return item;
		}), ['k']);

		return this._allJudges;
	}

	getData() {
		return new Promise((resolve: any) => {
			if (!_.isEmpty(this._allJudges)) {
				console.log(this._allJudges[0]);
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

	getRegions() {
		if (this._allRegions.length > 0) {
			return this._allRegions;
		}
		return getAllRegions(this._allJudges);
	}

	getDepartments() {
		if (this._allDepartments.length > 0) {
			return this._allDepartments;
		}

		return getAllDepartments(this._allJudges);
	}
}

export { IApi, Api }
