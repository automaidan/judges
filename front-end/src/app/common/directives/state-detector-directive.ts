export interface IStateRootScope extends angular.IRootScopeService {
    isGradient: boolean;
    currentState: string;
}
interface IScope extends angular.IScope {
    vm: any;
}
/** @ngInject */
export function StateDetector(): angular.IDirective {

    return {
        restrict: 'A',
        link: (scope: IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
            scope.$watch(() => {
                return scope.vm.rootScope.isGradient;
            }, (n: string) => {
                (n) ? element.addClass('main') : element.removeClass('main');
            });
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
