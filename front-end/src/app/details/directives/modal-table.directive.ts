interface IScope extends angular.IScope {
	renderedData: any;
	vm: any;
}
/** @ngInject */
export function ModalTable(): angular.IDirective {

	return {
		restrict: 'E',
		scope: {
			renderedData: '='
		},
		templateUrl: 'app/details/directives/modal-table.html',
		controller: Controller,
		controllerAs: 'vm',
		bindToController: true
	};

}

/** @ngInject */
export class Controller {
	isShown: any;
	constructor($scope: IScope) {
		this.isShown = false;
		$scope.$watch(() => {
			return $scope.vm.renderedData;
		}, (n) => {
			debugger;
			if(n) {
				$scope.vm.renderedData = n;
				$scope.vm.isShown = true;
			}
		}, true);
	}

	closeTable() {
		this.isShown = false;
	}
}