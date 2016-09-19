
interface IScope extends angular.IScope {
    vm: any;
}
/** @ngInject */
export function BarAnimateDirective(): angular.IDirective {

    return {
        restrict: 'A',
        link: (scope: IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
        },
    };

}

