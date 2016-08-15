'use strict';
import * as _ from 'lodash';
import { escapeRegExp } from '../../common/helper';
import { IDropDownOption } from '../../common/interfaces'

let context: any = null;

/** @ngInject */
interface IScope extends angular.IScope {
	data: any;
	fullMode: boolean;
	_api: any;
	vm: JudgesListController;
}

export function list(): angular.IDirective {
	return {
		restrict: 'E',
		scope: {
			data: '=data',
			fullMode: '='
		},
		templateUrl: 'app/components/list/judges-list.view.html',
		controller: JudgesListController,
		controllerAs: 'vm',
		bindToController: true,
		link: (scope: IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
			const table = element.find('.table__wrapper'),
				th = table.find('th');

			th.on('click', function () {
				const target = this;
				const isReversed = !Boolean(angular.element(target).attr('data-reversed'));
				const sortKey = angular.element(target).attr('data-sort');

				scope.vm.changeOrder(sortKey, isReversed);

				if (isReversed) {
					angular.element(target).attr('data-reversed', 'true');
				} else {
					angular.element(target).removeAttr('data-reversed');
				}

				scope.$apply();
			});
		}
	};

}
const DISPLAYING_LENGTH: number = 10;
/** @ngInject */

class JudgesListController {
	data: any;
	limit: number;
	skiped: number;
	_api: any;
	partialData: any;
	searchQuery: string;
	_originalData: any;
	allRegions: Array<IDropDownOption>;
	filterApplyed: boolean = false;
	selectedRegion: IDropDownOption;
	$scope: IScope;
	private _state: any;
	private _detailsUrl: string;
	private $filter: any;

	constructor($state: any, urls: any, Api: any, $scope: IScope, $filter: angular.IFilterProvider) {
		context = this;

		this._detailsUrl = urls.details;
		this._state = $state;
		this.limit = DISPLAYING_LENGTH;
		this.skiped = 0;
		this._api = Api;
		this.$scope = $scope;
		this.$filter = $filter;

		this._api.getData().then((res: any[]) => {
			this.data = angular.copy(res);
			this._originalData = angular.copy(res);
			this.allRegions = this._api.getRegions();
			this.selectedRegion = this.allRegions[0];
			this.searchQuery = this._state.params.query;

			this.search();
			$scope.$apply();
		});

	}

	toDetails(key: string) {
		this._state.go('details', {key});
	}

	toOrder(sortingKey: string, isReversed: boolean) {
		this.data.sort((prev: number, next: number) => {
			if (prev[sortingKey] > next[sortingKey]) {
				return 1;
			}
			if (prev[sortingKey] < next[sortingKey]) {
				return -1;
			}
			return 0;
		});

		if (isReversed) {
			this.data.reverse();
		}
	}

	changeOrder(sortingKey: string, isReversed: boolean) {
		this.toOrder(sortingKey, isReversed);
		this.getPartials();
	}

	showNext() {
		if (this.data.length > this.limit) {
			this.skiped += this.limit;
			this.getPartials();
		}
	}

	showPrevious() {
		if (this.skiped !== 0) {
			this.skiped -= this.limit;
			this.getPartials();
		}
	}

	getPartials() {
		this.partialData = this.data.slice(this.skiped, this.skiped + this.limit);
	}

	search() {
		const searchQuery = escapeRegExp(this.searchQuery);
		let dataForSearch = this._originalData;

		if (this.filterApplyed) {
			this.filterByRegions();
			dataForSearch = this.data;
		}

		const filtered = this.$filter('filterSearch')(dataForSearch, searchQuery);

		this.data = filtered.length > 0 ? filtered : [{n: 'Суддю не знайдено, спробуйте ще..', r: '', k: ''}];
		this.changeOrder('k', false);
	}

	filterByRegions() {
		if (this.filterApplyed) {
			this.data = this.$filter('filterByField')(this._originalData, this.selectedRegion.title, 'r');
		} else {
			this.data = this._originalData;
		}

	}

	toFilter(region: IDropDownOption) {
		context.selectedRegion = region;
		context.filterApplyed = !!context.selectedRegion.key;
		context.filterByRegions();
		context.changeOrder('k', false);
	}
}


