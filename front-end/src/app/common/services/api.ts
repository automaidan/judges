import * as _ from 'lodash';

interface IApi {
}

class Api implements IApi {
    private _allJudges: any;
    private _urls: any;
    private _http: angular.IHttpService;
    private _texts: any;

    // todo refactor to type DropDownlist
    private _allRegions: any;
    private _regionsDepartments: any;
    private _dictionary: any;

    /** @ngInject */
    constructor($http: angular.IHttpService, urls: any) {
        this._http = $http;
        this._urls = urls;
        this._allJudges = [];
        this._allRegions = [];
        this._regionsDepartments = {};
        this._texts = null;
    }

    getJudgesList() {
        return new Promise((resolve: any) => {
            if (!_.isEmpty(this._allJudges)) {
                resolve(this._allJudges);
                return true;
            }

            return this.getDictionary().then((dictionary: any) => {
                this.fetchJudges()
                    .then((response: any) => {
                        this._allJudges = this._deCryptJudges(dictionary, response);
                        resolve(this._allJudges);
                    });
            });
        });
    }

    getDictionary() {
        return new Promise((resolve: Function) => {

            if (_.isEmpty(this._dictionary)) {
                return this.fetchDictionary().then((dictionary: any) => {
                    this._dictionary = dictionary;

                    resolve(dictionary);
                });
            }

            resolve(this._dictionary);
        });
    }

    getOne(key: string) {
        return new Promise((resolve: Function) => {
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
                .then(resolve)
                .catch(reject);
        });
    }

    getRegions() {
        if (this._allRegions.length > 0) {
            return new Promise((resolve: any) => {
                resolve(this._allRegions);
            });
        }

        return new Promise((resolve: Function) => {
            return this.getDictionary()
                .then((dictionary: any) => {
                    return this.fetchDepartmentsRegions()
                        .then((response: any) => {
                            this._regionsDepartments = this._deCryptRegionsDepartments(dictionary, response);
                            this._allRegions = Object.keys(this._regionsDepartments).map((item: string) => {
                                return {
                                    title: item, key: item
                                };
                            });
                            resolve(this._allRegions);
                        });
                });
        });
    }

    getDepartments() {
        return new Promise((resolve: Function) => {
            if (Object.keys(this._regionsDepartments).length !== 0) {
                resolve(this._regionsDepartments);
            }

            return this.getDictionary().then((dictionary: any) => {
                return this.fetchDepartmentsRegions().then((res: any) => {
                    this._regionsDepartments = this._deCryptRegionsDepartments(dictionary, res);
                    resolve(this._regionsDepartments);
                });
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

    private fetchDictionary() {
        return this.fetchData(this._urls.dictionaryUrl);
    }

    private fetchJudges() {
        return this.fetchData(this._urls.listUrl);
    }

    private fetchDepartmentsRegions() {
        return this.fetchData(this._urls.regionsDepartments);
    }

    private _deCryptJudges(dictionary: any, allJudges: any) {
        return _.sortBy(allJudges.map((item: any) => {
            for (let key in item) {
                if (item.hasOwnProperty(key) && key !== 'k' && key !== 'n' && key !== 'a' && key !== 's') {
                    item[key] = dictionary[item[key]];
                }
            }
            return item;
        }), ['k']);
    }

	private _deCryptRegionsDepartments(dictionary: any, data: any) {
		const decrypted = {};
		for (let key in data) {
            if (data.hasOwnProperty(key)) {
                let region = dictionary[key];

                decrypted[region] = data[key].map((item: string) => {
                    return {
                        title: dictionary[item],
                        key: dictionary[item]
                    };
                }); 
            }
		}

		return decrypted;
	}
}

export {IApi, Api}
