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
    return str.join('&')
};

const deserializeUri = (str: string):IFilters => {
    return str.split('&')
        .reduce(function (obj: IFilters, item) {
            let keyVal: [string, string] = item.split('=');
            obj[keyVal[0]] = decodeURIComponent(keyVal[1]);
            return obj;
        }, { year: '', region: '', department: '', statistic: ''});
};

class AnalyticsController implements IAnalyticsController {
    public units: string;
    public data: any[];
    public allYears: IDropDownList = FILTERS.YEARS;
    public statistic: IDropDownList = FILTERS.STATISTICS;
    public allRegions: IDropDownList;
    public filterByIncomes: any = [];
    public filtersApplied: any = false;
    public availableDepartments: any;
    private $scope: any;
    private _api: any;
    private filters: IFilters;
    private originalData: any[];
    private $filter: any;
    private originalDepartments: any;
    private $location: angular.ILocationService;
    /* @ngInject */
    constructor(Api: any, $scope: angular.IScope, $filter: angular.IFilterProvider, $location: angular.ILocationService, $stateParams: any) {
        context = this;

        this._api = Api;
        this.$scope = $scope;
        this.$filter = $filter;
        this.$location = $location;

        if ($stateParams.query) {
            this.filters = deserializeUri($stateParams.query);
        } else {
            this.filters = {
                year: '2015',
                region: 'Загальнодержавний',
                department: 'Конституційний Суд України',
                statistic: 'i'
            };
        }

        this.configurateCharts();
        this.getData();
    }

    /** @ngInject */
    addFilter(option: IDropDownOption, filter: string) {
        context.$location.search({query: serializeUri(context.filters)});
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

        this.prepareDataToCharts(this.data);
    }

    private prepareDataToCharts(data: Array) {
        const _data = _.slice(data, 0, 9);
        this.$scope.labels = _.map(_data, 'n');
        this.$scope.data = _.map(_data, (d: any) => {
            return d.a[0][this.filters.statistic];
        });
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
    private configurateCharts () {
        this.$scope.options = {
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        };

        Chart.defaults.global.defaultFontColor = 'rgb(255,255,255)';
    }

    private getData() {
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
                this.filterApply();
                this.$scope.$applyAsync();
            });

    }

}

export { AnalyticsController };
