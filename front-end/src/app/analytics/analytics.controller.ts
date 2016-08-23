import * as _ from 'lodash';
import * as d3 from 'd3';
import {IDropDownOption} from '../common/interfaces';
import {IDropDownList} from '../common/interfaces';
import {FILTERS} from '../common/constants/constants';

interface IFilters {
    year: string;
    region: string;
    department: string;
    statistic: string;
}

interface IAnalyticsController {
    // getData(): void;
    addFilter(option: IDropDownOption, filter: string): void;
}

let context: any = null;

class AnalyticsController implements IAnalyticsController {
    public units: string;
    public data: any[];
    public allYears: IDropDownList = FILTERS.YEARS;
    public statistic: IDropDownList = FILTERS.STATISTICS;
    public allRegions: IDropDownList;
    // public filtersByDepartments: IDropDownList;
    public filterByIncomes: any = [];
    public filtersApplied: any = false;
    public availableDepartments: any;
    private $scope: any;
    private _api: any;
    private filters: IFilters = {
        year: '2015',
        region: 'Загальнодержавний',
        department: 'Конституційний Суд України',
        statistic: 'i'
    };
    private originalData: any[];
    private $filter: any;
    private originalDepartments: any;
    /* @ngInject */
    constructor(Api: any, $scope: angular.IScope, $filter: angular.IFilterProvider) {
        context = this;

        this._api = Api;
        this.$scope = $scope;
        this.$filter = $filter;

        this._api.getJudgesList()
            .then((response: any) => {
                this.data = response;
                this.originalData = angular.copy(response);
                return this._api.getDepartments();
            })
            .then((response: any) => {
                this.originalDepartments = response;
                this.availableDepartments = this.getAllDepartments(this.originalDepartments);
                return this._api.getRegions();
            })
            .then((response: any) => {
                this.allRegions = response;
                $scope.$applyAsync();
            });
    }

    /** @ngInject */
    addFilter(option: IDropDownOption, filter: string) {
        if (filter === 'region') {
            context.availableDepartments = context.filterDepartmentByRegion(context.originalDepartments, option.key);
            context.$scope.$evalAsync();
        }
        context.filters[filter] = option.key;
        context.filterApply();
    }

    filterApply() {
        this.data = this.originalData;

        if (this.filters.year) {
            this.data = this.$filter('filterByYear')(this.data, parseInt(this.filters.year, 10));
        }
        if (this.filters.region) {
            this.data = this.$filter('filterByField')(this.data, this.filters.region, 'r');
        }
        if (this.filters.department) {
            this.data = this.$filter('filterByField')(this.data, this.filters.department, 'd');
        }
        if (this.filters.statistic) {
            this.data = this.$filter('filterByAnalyticsField')(this.data, this.filters.statistic);
            this.units = ' ' + _.find(FILTERS.STATISTICS, {key: this.filters.statistic}).unit;
        }
    }

    private filterDepartmentByRegion(departmentRegionsObj: any, region: string) {
        let availableDepartments = [];

        if (region) {
            availableDepartments = departmentRegionsObj[region];
        } else {
            availableDepartments = this.getAllDepartments(departmentRegionsObj);
        }
        this.filters.department = availableDepartments[0].key;
        return availableDepartments;
    }

    private getAllDepartments(obj: any) {
        return _.reduce(_.keys(obj), (result: Array, key: string) => {
            return result.concat(obj[key]);
        }, []);
    }
}

export {AnalyticsController};
