import * as _ from 'lodash';
/** @ngInject */
interface IScope extends angular.IScope {
	data: any,
	vm: JudgesListController
}
export function list(): angular.IDirective {

	return {
		restrict: 'E',
		scope: {
			data: '=data'
		},
		templateUrl: 'app/components/list/judges-list.view.html',
		controller: JudgesListController,
		controllerAs: 'vm',
		bindToController: true,
		link: (scope: IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
			const table = element.find('.table-wrapper'),
				th = table.find('th');

			th.on('click', function (e) {
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
			})
		}
	};

}
const DISPLAYING_LENGTH: number = 25;
/** @ngInject */
export class JudgesListController {
	data: any;

	allJudges: any[];
	dtColumnDefs: any[];
	dtOptions: any;
	dictionary: any;
	limit: number;
	skiped: number;
	_api: any;

	private _state: any;
	private _detailsUrl: string;


	constructor($scope: IScope, $state: any, urls: any, Api: any) {
		this._detailsUrl = urls.details;
		this._state = $state;
		this.limit = DISPLAYING_LENGTH;
		this.skiped = 0;

		this._api = Api;
		this._api.getData().then(res => {
			this.data = res;
		});
	}

	toDetails(key: string) {
		this._state.go('details', {key});
	}

	toOrder(sortingKey, isReversed) {
		this.data.sort((prev, next) => {
			if (prev[sortingKey] > next[sortingKey]) {
				return 1;
			}
			if (prev[sortingKey] < next[sortingKey]) {
				return -1;
			}

			return 0;
		});
		if (isReversed) {
			this.data.reverse()
		}

	}

	changeOrder(sortingKey, isReversed) {
		this.toOrder(sortingKey, isReversed);
	}
}


