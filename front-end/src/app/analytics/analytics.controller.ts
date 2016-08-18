import { sortBy } from 'lodash';
import * as d3 from 'd3';

import { IDropDownOption } from '../common/interfaces';
import { IDropDownList } from '../common/interfaces';

// {
// 	"year": "y",
// 	"income": "i",
// 	"familyIncome": "m",
// 	"landArea": "l",
// 	"landAmount": "m",
// 	"houseArea": "h",
// 	"houseAmount": "e",
// 	"flatArea": "f",
// 	"flatAmount": "t",
// 	"carAmount": "c",
// 	"complaintAmount": "w",
// 	"complainsAmount": "j",
// 	"presentsEared": "v",
// 	"bankAccount": "b"
// }

interface IFilters {
	year: string;
	region: string;
	department: string;
	statistic: string;
}

interface IAnalyticsController {
	getData(): void;
}

let context: any = null;

class AnalyticsController implements IAnalyticsController {
	public data: any[];
	public allYears: IDropDownList = [
		{
			title: '2013',
			key: '2013'
		},
		{
			title: '2014',
			key: '2014'
		},
		{
			title: '2015',
			key: '2015'
		}
	];

	public statistic: IDropDownList = [
		{
			title: 'Найбільший дохід',
			key: 'i'
		},
		{
			title: 'Найбільший дім',
			key: 'h'
		},
		{
			title: 'Найбільша земельна ділянка',
			key: 'l'
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
			this.data = angular.copy(this.originalData);
		});
	}

	addFilter(option: IDropDownOption, filter: string) {
		context.filters[filter] = option.key;
		context.filterApply();
	}

	private filterApply() {
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
		if (this.filters.statistic) {
			const analyticsModel: {
				name: string,
				key: string,
				data: number,
				year: number
            } = {
				name: '',
				key: '',
				data: 0,
				year: null
			};
			const t = [];
			// this.originalData.filter((item: any) => {
			//
			// });

			// this.originalData.forEach((item: any) => {
			// 	const object = angular.copy(analyticsModel);
			//
			// 	item.a && item.a.forEach((analitic_data: any) => {
			// 		var filter_enabled: string = this.filters.year && analitic_data.y;
			//
			// 		if (filter_enabled) {
			// 			// var t = analitic_data.filter((item_inn: any) => {
			// 			// 	return item_inn.y === this.filters.year;
			// 			// })[0];
			//
			//
			// 		}
			// 	});
			// });


			//
			// this.data = this.originalData.filter((item: any) => {
			// 	return new RegExp(this.filters.statistic, 'i').test(item.a[index][this.filters.statistic]);
			// });
		}
	}

	private filterByProperty(key) {
	}
}

export { AnalyticsController };
