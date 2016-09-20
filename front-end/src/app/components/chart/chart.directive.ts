import { IDropDownAction } from '../../common/interfaces';
import { IDropDownOption } from '../../common/interfaces';
import { IDropDownList } from '../../common/interfaces';


interface IScope extends angular.IScope {
    data: string[];
    vm: any;
}


// const calcMax = (data) => {
//     return data.reduce((max, item) => {
//         return parseInt(item.a) > parseInt(max) ? item.a : max;
//     }, 0);
// };

/** @ngInject */
export function chart(): angular.IDirective {
    return {
        restrict: 'E',
        scope: {
            data: '=',
            callback: '=',
            units: '='
        },
        replace: true,
        templateUrl: 'app/components/chart/chart.view.html',
        controller: Controller,
        controllerAs: 'vm',
        bindToController: true,
        link: (scope: IScope, element: angular.IAugmentedJQuery) => {
            debugger;
            // scope.vm.layoutWidth = element.width() - element.width() * 0.3 - 30;
            //todo add removig of elements with 0 amout
            //todo refactored logic from chart directive into bar_directive(count calculation and animation)
            scope.$watch(()=> {
                return scope.vm.data;
            }, (n)=> {
                if (n) {
                    scope.vm.data = n;
                    scope.vm.max = scope.vm.data[0].a;
                }
            });
        }
    };
}

/** @ngInject */
export class Controller {
    public data: any[];
    public max: number = 0;
    public callback: any;
    public units:string;

    onClick(id) {
        this.callback(id)
    }
}