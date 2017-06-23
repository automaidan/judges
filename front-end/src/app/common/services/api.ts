import * as _ from 'lodash';

interface IApi {
}

class Api implements IApi {
    private _allJudges: any;
    private _allProsecutors: any;
    private _urls: any;
    private _http: angular.IHttpService;
    private _texts: any;

    // todo refactor to type DropDownlist
    private _allJudgesRegions: any;
    private _allProsecutorsRegions: any;
    private _judgesRegionsDepartments: any;
    private _prosecutorsRegionsDepartments: any;
    private _dictionary: any;

    /** @ngInject */
    constructor($http: angular.IHttpService, urls: any) {
        this._http = $http;
        this._urls = urls;
        this._allJudges = [];
        this._allProsecutors = [];
        this._allJudgesRegions = [];
        this._allProsecutorsRegions = [];
        this._judgesRegionsDepartments = {};
        this._prosecutorsRegionsDepartments = {};
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

    getProsecutorsList() {
        return new Promise((resolve: any) => {
            if (!_.isEmpty(this._allProsecutors)) {
                resolve(this._allProsecutors);
                return true;
            }

            return this.getDictionary().then((dictionary: any) => {
                this.fetchProsecutors()
                    .then((response: any) => {
                        this._allProsecutors = this._deCryptJudges(dictionary, response);
                        resolve(this._allProsecutors);
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
        if (this._allJudgesRegions.length > 0) {
            return new Promise((resolve: any) => {
                resolve(this._allJudgesRegions);
            });
        }

        return new Promise((resolve: Function) => {
            return this.getDictionary()
                .then((dictionary: any) => {
                    return this.fetchDepartmentsRegions()
                        .then((response: any) => {
                            this._judgesRegionsDepartments = this._deCryptRegionsDepartments(dictionary, response);
                            this._allJudgesRegions = Object.keys(this._judgesRegionsDepartments).map((item: string) => {
                                return {
                                    title: item, key: item
                                };
                            });
                            resolve(this._allJudgesRegions);
                        });
                });
        });
    }

    getProsecutorsRegions() {
        if (this._allProsecutorsRegions.length > 0) {
            return new Promise((resolve: any) => {
                resolve(this._allProsecutorsRegions);
            });
        }

        return new Promise((resolve: Function) => {
            return this.getDictionary()
                .then((dictionary: any) => {
                    return this.fetchProsecutorsDepartmentsRegions()
                        .then((response: any) => {
                            this._prosecutorsRegionsDepartments = this._deCryptRegionsDepartments(dictionary, response);
                            this._allProsecutorsRegions = Object.keys(this._prosecutorsRegionsDepartments).map((item: string) => {
                                return {
                                    title: item, key: item
                                };
                            });
                            resolve(this._allProsecutorsRegions);
                        });
                });
        });
    }


    getDepartments() {
        return new Promise((resolve: Function) => {
            if (Object.keys(this._judgesRegionsDepartments).length !== 0) {
                resolve(this._judgesRegionsDepartments);
            }

            return this.getDictionary().then((dictionary: any) => {
                return this.fetchDepartmentsRegions().then((res: any) => {
                    this._judgesRegionsDepartments = this._deCryptRegionsDepartments(dictionary, res);
                    resolve(this._judgesRegionsDepartments);
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

    private fetchProsecutors() {
        return this.fetchData(this._urls.prosecutorsListUrl);
    }

    private fetchDepartmentsRegions() {
        return this.fetchData(this._urls.regionsDepartments);
    }

    private fetchProsecutorsDepartmentsRegions() {
        return this.fetchData(this._urls.prosecutorsRegionsDepartments);
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
