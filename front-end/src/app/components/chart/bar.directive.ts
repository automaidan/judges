
interface IScope extends angular.IScope {
    maxValue: number;
    data: number;
    units: string;
}

const calcWidth = (data: number, maxValue: number) => {
    return (Number(data) / Number(maxValue)) * 100 - 10;
};
/** @ngInject */
export function BarDirective(): angular.IDirective {

    return {
        restrict: 'E',
        scope: {
            maxValue: '=',
            data: '=',
            units: '='
        },
        link: (scope: IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
            const bar = element.find('.chart-row__bar')[0];

            scope.$watch(() => {
                return scope.data;
            }, (n: any) => {
                if (n) {
                    angular.element(bar).width(calcWidth(n, scope.maxValue) + '%');
                    angular.element(bar).attr('title', String(n) + scope.units);
                    angular.element(element.find('.amount')[0]).html(String(n) + scope.units);
                }
            });
        },
        template: `<div class="chart-row__bar" title="">
                    <span><span class = "amount">{content}</span></span>
                 </div>`
    };

}
