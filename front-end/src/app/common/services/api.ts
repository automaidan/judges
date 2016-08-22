// import * as _ from 'lodash';
import * as _ from 'lodash';
import { IDropDownOption } from '../interfaces';
import { IDropDownList } from '../interfaces';

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
	return data.reduce((reduced: any[], item: any) => {
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

class Api implements IApi {
	private _allJudges: any;
	private _urls: any;
	private _http: angular.IHttpService;
	private _texts: any;
	private _timestamps: any = {};
	private _allRegions: any;//todo refactored to type DropDownlist
	private _regionsDepartments: any;
	private _dictionary: any;

	/** @ngInject */
	constructor($http: angular.IHttpService, urls: any) {
		this._http = $http;
		this._urls = urls;
		this._allJudges = [];
		this._allRegions = [];
		// this._timestamps = JSON.parse(localStorage.getItem(STORAGES.timestamps)) || {};
		this._regionsDepartments = {};
		this._texts = null;

		// this.fetchTimestamps().then((_timestamps: any) => {
		// 	if (_.isEmpty(this._timestamps)
		// 		|| _timestamps.dictionary !== this._timestamps.dictionary
		// 		|| _timestamps.list !== this._timestamps.list
		// 		|| _timestamps.text !== this._timestamps.text) {
		//
		// 		this._timestamps = angular.copy(_timestamps);
		// 		setToStorage(STORAGES.timestamps, _timestamps);
		// 		this.fetchAll();
		// 	}
		// });
	}


	getJudgesList() {
		return new Promise((resolve: any) => {
			if (!_.isEmpty(this._allJudges)) {
				resolve(this._allJudges);
				return true;
			}

			return this.getDictionary().then(dictionary => {
				this.fetchJudges()
					.then((resp) => {
						this._allJudges = this._deCryptJudges(dictionary, resp);
						resolve(this._allJudges);
					});
			})
		});
	}

	getDictionary() {
		return new Promise(resolve => {

			if (_.isEmpty(this._dictionary)) {
				return this.fetchDictionary().then(dictionary => {
					this._dictionary = dictionary;

					resolve(dictionary);
				});
			}

			resolve(this._dictionary);
		})
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
			return new Promise((res) => {
				res(this._allRegions);
			})
		}

		return new Promise((resolve) => {
			return this.getDictionary().then(dictionary => {
				return this.fetchDepartmentsRegions().then(resp => {
					this._regionsDepartments = this._deCryptRegionsDepartments(dictionary, resp);
					this._allRegions = Object.keys(this._regionsDepartments).map((item: string) => {
						return {
							title: item, key: item
						}
					});
					resolve(this._allRegions);
				})
			});
		});
	}

	getDepartments() {
		return new Promise(resolve => {
			if (Object.keys(this._regionsDepartments).length !== 0) {
				resolve(this._regionsDepartments);
			}

			return this.getDictionary().then(dictionary => {
				return this.fetchDepartmentsRegions().then(res => {
					this._regionsDepartments = this._deCryptRegionsDepartments(dictionary, res);
					resolve(this._regionsDepartments);
				})
			});
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

	// private fetchAll() {
	// 	let promiseArr = [
	// 		this.fetchData(this._urls.textUrl),
	// 		this.fetchData(this._urls.regionsDepartments)
	// 	];
	//
	// 	return Promise.all(promiseArr).then((res: any) => {
	// 		this._allJudges = this._deCryptJudges(res[0], res[1]);
	//
	//
	// 		this._regionsDepartments = this._deCryptRegionsDepartments(res[0], res[3]);
	//
	// 		this._allRegions = Object.keys(this._regionsDepartments).map((item: string) => {
	// 			return {
	// 				title: item, key: item
	// 			}
	// 		});
	//
	// 		setToStorage(STORAGES.regions, this._allRegions);
	// 		setToStorage(STORAGES.departments, this._regionsDepartments);
	// 		setToStorage(STORAGES.list, this._allJudges);
	// 	});
	// }

	private fetchDictionary() {
		return this.fetchData(this._urls.dictionaryUrl).then(res => {
			return res;
		})
	}

	private fetchJudges() {
		return this.fetchData(this._urls.listUrl).then((res) => {
			return res;
		})
	}

	private fetchTexts() {
		return this.fetchData(this._urls.textUrl).then(function (resp) {
			return resp;
		});
	}

	private fetchDepartmentsRegions() {
		return this.fetchData(this._urls.regionsDepartments).then(function (resp) {
			return resp;
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

	private _deCryptJudges(dictionary: any, allJudges: any) {
		return _.sortBy(allJudges.map((item: any) => {
			for (let key in item) {
				if (item.hasOwnProperty(key) && key !== 'k' && key !== 'n' && key !== 'a') {
					item[key] = dictionary[item[key]];
				}
			}
			return item;
		}), ['k']);
	}

	private _deCryptRegionsDepartments(dictionary: any, data: any) {
		const decrypted = {};
		for (let key in data) {
			let region = dictionary[key];

			decrypted[region] = data[key].map((item: string) => {
				return {
					title: dictionary[item],
					key: dictionary[item]
				};
			});
		}

		return decrypted;
	}
}

export { IApi, Api }
