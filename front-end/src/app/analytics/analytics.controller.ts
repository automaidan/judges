import * as _ from 'lodash';
import { IDropDownOption } from '../common/interfaces';
import { IDropDownList } from '../common/interfaces';
import { FILTERS } from '../common/constants/constants';

interface IFilters {
    year: string;
    region: string;
    department: string;
    statistic: string;
}

interface IAnalyticsController {
    addFilter(option: IDropDownOption, filter: string): void;
    filterApply(): void;
}

let context: any = null;

const serializeUri = (obj: any) => {
    const str = [];

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
        }
    }
    return str.join('&');
};

const deserializeUri = (str: string): IFilters => {
    return str.split('&')
        .reduce(function (obj: IFilters, item: any) {
            let keyVal: [string, string] = item.split('=');
            obj[keyVal[0]] = decodeURIComponent(keyVal[1]);
            return obj;
        }, {year: '', region: '', department: '', statistic: ''});
};

class AnalyticsController implements IAnalyticsController {
    public units: string;
    public data: Array<Object>;
    public allYears: IDropDownList = FILTERS.YEARS;
    public statistic: IDropDownList = FILTERS.STATISTICS;
    public allRegions: IDropDownList;
    public filterByIncomes: any = [];
    public filtersApplied: any = false;
    public availableDepartments: any;
    public selectedRegion: any = null;
    public selectedStatisticField: any = null;
    public selectedDepartment: any = null;
    public max: number = 0;

    private $scope: any;
    private _api: any;
    private filters: IFilters = {year: '', region: '', department: '', statistic: 'i'};
    private originalData: any[];
    private $filter: any;
    private originalDepartments: any;
    private $location: angular.ILocationService;
    private $q: angular.IQService;
    private $state: any;
    /* @ngInject */
    constructor(Api: any,
                $scope: angular.IScope,
                $filter: angular.IFilterProvider,
                $location: angular.ILocationService,
                $stateParams: any,
                $q: angular.IQService,
                $state: any) {

        context = this;

        this._api = Api;
        this.$scope = $scope;
        this.$filter = $filter;
        this.$location = $location;
        this.$q = $q;
        this.$state = $state;

        if ($stateParams.query) {
            this.filters = deserializeUri($stateParams.query);
        }

        this.init();
    }

    /** @ngInject */
    addFilter(option: IDropDownOption, filter: string) {
        if (filter === 'region') {
            context.availableDepartments = context.filterDepartmentByRegion(context.originalDepartments, option.key);
            context.filters.department = context.availableDepartments[0].key;
            context.$scope.$applyAsync();
        }
        if (filter === 'department') {
            context.filters.region = context.filterRegionByDepartment(context.originalDepartments, option.key);
            context.selectedRegion = context.filters.region;
            context.$scope.$applyAsync();
        }
        context.filters[filter] = option.key;
        context.$state.go('.', {query: serializeUri(context.filters)}, {notify: false});
        context.filterApply();
    }

    filterApply() {
        let data = angular.copy(this.originalData);

        return this.$q((resolve_last: Function) => {
            return new Promise((resolve: Function) => {
                if (this.filters.year) {
                    return this.$filter('filterByYear')(data, parseInt(this.filters.year, 10)).then(function (resp: any) {
                        resolve(resp);
                    });
                } else {
                    resolve(data);
                }
            }).then((data: any) => {
                return new Promise((resolve: Function) => {
                    if (this.filters.region && this.filters.region !== 'all') {
                        return this.$filter('filterByField')(data, this.filters.region, 'r').then(function (resp: any) {
                            resolve(resp);
                        });
                    } else {
                        resolve(data);
                    }
                });
            }).then((data: any) => {
                return new Promise((resolve: Function) => {
                    if (this.filters.department && this.filters.department !== 'all') {
                        return this.$filter('filterByField')(data, this.filters.department, 'd').then(function (resp: any) {
                            resolve(resp);
                        });
                    } else {
                        resolve(data);
                    }
                });
            }).then((data: any) => {
                return new Promise((resolve: Function) => {
                    if (this.filters.statistic) {
                        this.units = ' ' + _.find(FILTERS.STATISTICS, {key: this.filters.statistic}).unit;
                        resolve(this.$filter('filterByAnalyticsField')(data, this.filters.statistic, _.find(FILTERS.STATISTICS, {key: this.filters.statistic}).limitTo));
                    } else {
                        resolve(data);
                    }
                });
            }).then((data: any) => {
                resolve_last(data);
            });
        }).then((data: Array<Object>) => {
            this.data = data;
            this.selectedStatisticField = this.filters.statistic;
            this.selectedRegion = this.filters.region;
            this.selectedDepartment = this.filters.department;
            this.$scope.$applyAsync();
        });
    }

    toDetails(id: any) {
        context.$state.go('details', {key: id});
    }

    private filterDepartmentByRegion(departmentRegionsObj: any, region: string) {
        let availableDepartments = [];

        if (region && region !== 'all') {
            availableDepartments = departmentRegionsObj[region];
            availableDepartments.unshift({key: 'all', title: 'Всі департаменти'});
        } else {
            availableDepartments = this.getAllDepartments(departmentRegionsObj);
            availableDepartments.unshift({key: 'all', title: 'Всі департаменти'});
        }

        return availableDepartments;
    }

    private filterRegionByDepartment(departmentRegionsObj: any, department: string) {
        let selectedRegion = null;

        for (let r in departmentRegionsObj) {
            if (departmentRegionsObj.hasOwnProperty(r)) {
                for (let d of departmentRegionsObj[r]) {
                    if (d.key === department) {
                        selectedRegion = r;
                        break;
                    }
                }
                if (selectedRegion) {
                    break;
                }
            }
        }

        return selectedRegion;
    }

    private getAllDepartments(obj: any) {
        const _departments = _.reduce(_.keys(obj), (result: Array<any>, key: string) => {
            return result.concat(obj[key]);
        }, []);

        _departments.unshift({key: 'all', title: 'Всі департаменти'});
        return _departments;
    }


    private init() {
        this.filters.year = this.filters.year || this.allYears[0].key;

        return this._api.getJudgesList()
            .then((response: any) => {
                this.originalData = angular.copy(response);
                return this._api.getDepartments();
            })
            .then((response: any) => {
                this.originalDepartments = response;
                this.availableDepartments = this.getAllDepartments(this.originalDepartments);
                this.filters.department = this.filters.department || this.availableDepartments[0].key;
                return this._api.getRegions();
            })
            .then((response: any) => {
                this.allRegions = (response.unshift({key: 'all', title: 'Всі області'})) && response;
                this.filters.region = this.filters.region || this.allRegions[0].key;
                return this.filterApply();
            });
    }

}

export { AnalyticsController };
