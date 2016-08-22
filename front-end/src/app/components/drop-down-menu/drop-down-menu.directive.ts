import { IDropDownAction } from '../../common/interfaces';
import { IDropDownOption } from '../../common/interfaces';
import { IDropDownList } from '../../common/interfaces';


interface IScope extends angular.IScope {
	data: string[];
	action: IDropDownAction;
	vm: any;
}
/** @ngInject */
export function dropDownMenu(): angular.IDirective {
	return {
		restrict: 'E',
		scope: {
			data: '=',
			action: '=',
			defaultField: '@',
			filterType: '@'
		},
		templateUrl: 'app/components/drop-down-menu/drop-down-menu.view.html',
		controller: Controller,
		controllerAs: 'vm',
		bindToController: true,
		link: (scope: IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
			const btnOpen = element.find('.drop_down_menu__title');

			if (window.screen.availHeight < 800) {
				btnOpen.on('click', () => {
					angular.element('html,body').animate({
							scrollTop: angular.element(btnOpen).offset().top - 10
						},
						'slow');

				});
			}

			scope.$watch(() => {
				return scope.vm.data;
			}, (n: any) => {
				if (n) {
					scope.vm.selectedField = n[0];
				}
			});

		}
	};
}

/** @ngInject */
export class Controller {
	action: IDropDownAction;
	selectedField: IDropDownOption;
	data: IDropDownList;
	filterType: string;
	opened: boolean = false;


	select(key: any) {
		this.opened = false;
		this.selectedField = key;
		this.action(key, this.filterType);
	}

	toggle() {
		this.opened = !this.opened;
	}

}
