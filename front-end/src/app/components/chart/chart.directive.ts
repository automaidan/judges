import { IDropDownAction } from '../../common/interfaces';
import { IDropDownOption } from '../../common/interfaces';
import { IDropDownList } from '../../common/interfaces';


interface IScope extends angular.IScope {
    data: string[];
    action: IDropDownAction;
    vm: any;
}
/** @ngInject */
export function chart(): angular.IDirective {
    return {
        restrict: 'E',
        scope: {
            data: '=',
            maxValue: '='
        },
        replace: true,
        templateUrl: 'app/components/chart/chart.view.html',
        controller: Controller,
        controllerAs: 'vm',
        bindToController: true,
        link: (scope: IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
            const btnOpen = element.find('.drop_down_menu__title');
            const page = element.find('.page');
            const dropDownContent = element.find('.drop_down_menu__content');

            debugger;
            scope.vm.layoutWidth = element.width()-element.width()*0.3;
            scope.vm.layoutWidth = element.width()-element.width()*0.3;
            scope.$watch(()=> {
                return scope.vm.data;
            }, (n)=> {
                if(n) {
                    scope.vm.data = n;
                    scope.vm.max = scope.vm.calcMax(scope.vm.data)
                }
            });

            scope.$on('ngRepeatFinish', () => {
                debugger;
            })

        }
    };
}

/** @ngInject */
export class Controller {
    public data: any[];
    public layoutWidth: number;
    public layoutHeight: number;
    public max: number = 0;

    constructor() {

    }

    calcHeight () {

    }

    calcWidth(item) {
        return item.a / this.max * (this.layoutWidth)
    }

    private calcMax (data) {
        return data.reduce((max, item) => {
            return item.a > max ? item.a : max;
        }, 0);
    }



    // private findMaxValue (data) {
    //     const _data = angular.copy(data);
    //
    //     return _data.reduce((max, item) => {
    //         return item.a[0][this.filters.statistic] > max ? item.a[0][this.filters.statistic] : max;
    //     }, 0);
    // }

}
