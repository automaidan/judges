import * as _ from 'lodash';
/** @ngInject */
interface IScope extends angular.IScope {
	data: any,
	fullMode: boolean,
	_api: any,
	vm: JudgesListController
}
export function list(): angular.IDirective {

	return {
		restrict: 'E',
		scope: {
			data: '=data',
			fullMode: '=',
		},
		templateUrl: 'app/components/list/judges-list.view.html',
		controller: JudgesListController,
		controllerAs: 'vm',
		bindToController: true,
		link: (scope: IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
			const table = element.find('.table__wrapper'),
				th = table.find('th');

			scope.vm._api.getData().then((res: any) => {
				scope.vm.data = res;
				scope.vm.toOrder('k', false);
				debugger;
				scope.vm.getPartials();
				scope.$apply();
			});
			debugger;
			th.on('click', function () {
				const target = this;
				const isReversed = !Boolean(angular.element(target).attr('data-reversed'));
				const sortKey = angular.element(target).attr('data-sort');

				scope.vm.changeOrder(sortKey, isReversed);

				if (isReversed) {
					angular.element(target).attr('data-reversed', "true");
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
export class JudgesListController {
	data: any;
	limit: number;
	skiped: number;
	_api: any;
	partialData: any;
	searchQuery: string;
	viewData: any;

	private _state: any;
	private _detailsUrl: string;


	constructor($state: any, urls: any, Api: any) {
		this._detailsUrl = urls.details;
		this._state = $state;
		this.limit = DISPLAYING_LENGTH;
		this.skiped = 0;
		this._api = Api;
	}

	toDetails(key: string) {
		this._state.go('details', {key});
	}

	toOrder(sortingKey: string, isReversed: boolean) {
		this.data.sort((prev, next) => {
			if (prev[sortingKey] > next[sortingKey]) {
				return 1;
			}
			if (prev[sortingKey] < next[sortingKey]) {
				return  -1;
			}
			return 0;
		});

		isReversed && this.data.reverse();
	}

	changeOrder(sortingKey, isReversed) {
		this.toOrder(sortingKey, isReversed);
		this.getPartials();
	}

	showNext() {
		this.skiped += this.limit;
		this.getPartials();
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
	// search() {
	// 	this.data.filter((item:any) => {
	// 		return
	// 	})
	// }

}


