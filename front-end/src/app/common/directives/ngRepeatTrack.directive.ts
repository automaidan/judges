/**
 * Created by IlyaLitvinov on 08.09.16.
 */
interface IScope extends angular.IScope {
    $last: any;
}
/** @ngInject */
export function ngRepeatTrack(): angular.IDirective {

    return {
        restrict: 'A',
        link: (scope: IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
            angular.element(element).css('color','blue');
            if (scope.$last){
                scope.$emit('ngRepeatFinish');
            }
        }
    };

}
