import { IDropDownAction } from '../../common/interfaces';
import { IDropDownOption } from '../../common/interfaces';
import { IDropDownList } from '../../common/interfaces';


interface IScope extends angular.IScope {
    data: string[];
    action: IDropDownAction;
    vm: any;
}
const linkFunction = (scope: IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
    const btnOpen = element.find('.drop_down_menu__title');
    const page = element.find('.page');
    const dropDownContent = element.find('.drop_down_menu__content');

    if (window.screen.availHeight < 700) {
        btnOpen.on('click', () => {
            angular.element('html,body').animate({
                    scrollTop: angular.element(btnOpen).offset().top - 10
                },
                'slow');
        });
    }

    btnOpen.on('click', () => {
        page.css({display: 'block'});
    });

    page.on('click', () => {
        page.css({display: 'none'});
        scope.vm.opened = false;
        scope.$applyAsync();
    });

    dropDownContent.on('click', () => {
        page.css({display: 'none'});
    });

    scope.$watch(() => {
        return scope.vm.data;
    }, (n: any) => {
        if (n) {
            scope.vm._selectedField = n[0];
            scope.$applyAsync();
        }
    });

    if (scope.vm.selectedField !== undefined) {
        scope.$watch(() => {
            return scope.vm.selectedField;
        }, (n: any) => {
            if (n) {

                scope.vm._selectedField = scope.vm.data.filter((item) => {
                    return item.key === n
                })[0];
                scope.$applyAsync();
            }
        });
    }
};

/** @ngInject */
export class Controller {
    action: IDropDownAction;
    _selectedField: IDropDownOption;
    data: IDropDownList;
    filterType: string;
    opened: boolean = false;
    selected: string = '';
    indexOfSelectedOption: number = 0;

    constructor() {
    }

    select(option: any) {
        debugger;
        this.opened = false;
        this._selectedField = option;
        this.action(option, this.filterType);
    }

    toggle() {
        this.opened = !this.opened;
        if(this.opened == true) {
            this.indexOfSelectedOption = 0;
            this.selected = this.data[this.indexOfSelectedOption].key;
        }
    }

    keydown(e) {
        if (e.keyCode === 38 && this.indexOfSelectedOption > 0) {
            e.preventDefault();
            --this.indexOfSelectedOption;
            this.selected = this.data[this.indexOfSelectedOption].key;
        }
        if (e.keyCode === 40 && this.indexOfSelectedOption < this.data.length) {
            e.preventDefault();
            ++this.indexOfSelectedOption;
            this.selected = this.data[this.indexOfSelectedOption].key;
        }
        if(e.keyCode === 13) {
            let selectedOption = this.data.filter((item) => {
                return item.key === this.selected
            })[0];
            this.select(selectedOption);
            this.toggle();
        }
    }

}

/** @ngInject */
export function dropDownMenu(): angular.IDirective {
    return {
        restrict: 'E',
        scope: {
            data: '=',
            action: '=',
            defaultField: '@',
            filterType: '@',
            selectedField: '='
        },
        templateUrl: 'app/components/drop-down-menu/drop-down-menu.view.html',
        controller: Controller,
        controllerAs: 'vm',
        bindToController: true,
        link: linkFunction
    };
}


