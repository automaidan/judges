// /** @ngInject */
// export function StateDetector(): angular.IDirective {
// 	/** @ngInject */
// 	return {
// 		restrict: 'A',
// 		link: (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
// 			console.log("TEst");
// 			scope.$watch(() => {
// 				return location.pathname;
// 			}, (n) => {
// 				debugger;
// 			})
// 		},
// 		controller: controller
// 	};
// }
//
// function comntroller ($state: any, $rootScope: angular.IRootScopeService) => {
// 	debugger;
// }

export interface IStateRootScope extends angular.IRootScopeService {
	isGradient: boolean;
}
interface IScope extends angular.IScope {
	vm: any
}
/** @ngInject */
export function StateDetector(): angular.IDirective {

	return {
		restrict: 'A',
		link: (scope: IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
			scope.$watch(() => {
				return scope.vm.rootScope.isGradient;
			}, (n) => {
				(n) ? element.addClass('main') : element.removeClass('main')
			})
		},
		controller: Controller,
		controllerAs: 'vm',
		bindToController: true
	};

}

/** @ngInject */
class Controller {
	rootScope: IStateRootScope;

	constructor($state: any, $rootScope: IStateRootScope) {
		this.rootScope = $rootScope;
		this.rootScope.isGradient = false;
	}

}