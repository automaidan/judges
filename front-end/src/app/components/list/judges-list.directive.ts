'use strict';
import * as _ from 'lodash';
import { escapeRegExp } from '../../common/helper';
let context: any = null;

/** @ngInject */
interface IScope extends angular.IScope {
	data: any;
	fullMode: boolean;
	_api: any;
	vm: JudgesListController;
}

interface IRegion {
	title: string;
	key: string;
}

const getRegions = (data: any[]) => {
	const allRegions = data.reduce((reduced, item)=> {
		const region = {
			title: item.r,
			key: item.r
		};

		if (!_.find(reduced, region)) {
			reduced.push({
				title: item.r,
				key: item.r
			});
		}
		return reduced;
	}, []);
	debugger;
	allRegions.unshift({
		title: 'Всі регіони',
		key: 'Всі регіони'
	});
	return allRegions
};

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
	allRegions: string[];
	filterApplyed: boolean = false;
	selectedRegion: IRegion = {
		title: 'Всі регіони',
		key: 'Всі регіони'
	};
	$scope: IScope;
	private _state: any;
	private _detailsUrl: string;


	constructor($state: any, urls: any, Api: any, $scope: IScope) {
		context = this;
		this._detailsUrl = urls.details;
		this._state = $state;
		this.limit = DISPLAYING_LENGTH;
		this.skiped = 0;
		this._api = Api;
		this.$scope = $scope;
		this._api.getData().then((res: any[]) => {
			this.data = angular.copy(res);
			this._originalData = angular.copy(res);
			this.allRegions = getRegions(res);
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
		debugger;
		const searchQuery = escapeRegExp(this.searchQuery);
		let dataForSearch = this._originalData;

		if (this.filterApplyed) {
			this.filterByRegions();
			dataForSearch = this.data;
		}

		const filtered = dataForSearch.filter((item: any) => {
			return new RegExp(searchQuery, 'i').test(item.n)
				|| new RegExp(searchQuery, 'i').test(item.d);
		});

		this.data = filtered.length > 0 ? filtered : [{n: 'Суддю не знайдено, спробуйте ще..', r: '', k: ''}];
		this.changeOrder('k', false);
	}

	filterByRegions() {
		if (this.filterApplyed) {
			this.data = this._originalData.filter((item: any) => {
				debugger;
				return new RegExp(this.selectedRegion.title, 'i').test(item.r);
			});
		} else {
			this.data = this._originalData;
		}

	}

	toFilter(region: IRegion) {
		context.selectedRegion = region;
		context.filterApplyed = context.selectedRegion.title !== 'Всі регіони';
		context.filterByRegions();
		context.changeOrder('k', false);
	}
}


