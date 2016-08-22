
import * as d3 from 'd3';

import { IDropDownOption } from '../common/interfaces';
import { IDropDownList } from '../common/interfaces';

interface IFilters {
	year: string;
	region: string;
	department: string;
	statistic: string;
}

interface IAnalyticsController {
	getData(): void;
	addFilter(option: IDropDownOption, filter: string): void;
}

let context: any = null;

class AnalyticsController implements IAnalyticsController {
	public units: string;
	public data: any[];
	public allYears: IDropDownList = [
        {
            title: '2015',
            key: '2015'
        },
		{
			title: '2014',
			key: '2014'
		},
        {
            title: '2013',
            key: '2013'
        }
	];

	public statistic: IDropDownList = [
		{
			title: 'Найбільший дохід',
			key: 'i'
		},
        {
            title: 'Найбільший дохід сім’ї',
            key: 'm'
        },
        {
            title: 'Найбільша площа земельних ділянок',
            key: 'l'
        },
        {
            title: 'Найбільша кількість земельних ділянк',
            key: 'z'
        },
		{
			title: 'Найбільша площа домівок',
			key: 'h'
		},
        {
            title: 'Найбільша кількість домівок',
            key: 'e'
        },
        {
            title: 'Найбільша площа квартир',
            key: 'f'
        },
        {
            title: 'Найбільша кількість квартир',
            key: 't'
        },
        {
            title: 'Найбільша кількість машин',
            key: 'с'
        },
        {
            title: 'Найбільше грошей в банку',
            key: 'b'
        },
        {
            title: 'Найбільша кількість скарг',
            key: 'j'
        },
        {
            title: 'Найбільша кількість розглянутих справ',
            key: 'w'
        }
	];

	public allRegions: IDropDownList;
	// public filtersByDepartments: IDropDownList;
	public allDepartments: IDropDownList;
	public filterByIncomes: any = [];
	public filtersApplied: any = false;

	private $scope: any;
	private _api: any;
	private filters: IFilters = {
		year: '',
		region: '',
		department: '',
		statistic: ''
	};
	private originalData: any[];
	private $filter: any;

	/* @ngInject */
	constructor(Api: any, $scope: angular.IScope, $filter: angular.IFilterProvider) {
		context = this;

		this._api = Api;
		this.$scope = $scope;
		this.allRegions = this._api.getRegions();
		this.allDepartments = this._api.getDepartments();
		this.$filter = $filter;

		this.getData();
	}

	/** @ngInject */
	getData() {
		return this._api.getData().then((res: any[]) => {
			this.originalData = res;
			this.data = [];
		});
	}

	addFilter(option: IDropDownOption, filter: string) {
		context.filters[filter] = option.key;
	}

	filterApply() {
		this.data = this.originalData;

		if (this.filters.year) {
			this.data = this.$filter('filterByYear')(this.data, parseInt(this.filters.year, 10));
		}
		if (this.filters.region) {
			this.data = this.$filter('filterByField')(this.data, this.filters.region, 'r');
			// this.allDepartments = this.$filter('filterAvailableDepartments')(this.allDepartments, this.filters.region)
		}
		if (this.filters.department) {
			this.data = this.$filter('filterByField')(this.data, this.filters.department, 'd');
		}
		// if (this.filters.department) {
		// 	this.data = this.$filter('filterByField')(this.data, this.filters.department, 'd');
		// }
		if (this.filters.statistic) {
			this.data = this.$filter('filterByAnalitycsField')(this.data, this.filters.statistic);
			this.units = (this.filters.statistic === 'i') ? 'грн' : '';
		}
	}
}

export { AnalyticsController };
