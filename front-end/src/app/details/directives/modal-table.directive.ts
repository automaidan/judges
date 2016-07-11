interface IScope extends angular.IScope {
	renderedData: any;
	isShown: any;
	vm: any;
}
/** @ngInject */
export function ModalTable(): angular.IDirective {

	return {
		restrict: 'E',
		scope: {
			renderedData: '=',
			isShown: '='
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
		// $scope.$watch(() => {
		// 	return $scope.vm.renderedData;
		// }, (n) => {
		// 	if(n) {
		// 		$scope.vm.renderedData = n;
		// 	}
		// }, false);
	}

	closeTable() {
		debugger;
		this.isShown = false;
	}
}