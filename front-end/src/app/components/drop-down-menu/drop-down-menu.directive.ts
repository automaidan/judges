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
			filterType: '@',
			selectedField: '='
		},
		templateUrl: 'app/components/drop-down-menu/drop-down-menu.view.html',
		controller: Controller,
		controllerAs: 'vm',
		bindToController: true,
		link: (scope: IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {
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

			if(scope.vm.selectedField !== undefined) {
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

		}
	};
}

/** @ngInject */
export class Controller {
	action: IDropDownAction;
	_selectedField: IDropDownOption;
	data: IDropDownList;
	filterType: string;
	opened: boolean = false;


	select(option: any) {
		this.opened = false;
		this._selectedField = option;
		this.action(option, this.filterType);
	}

	toggle() {
		this.opened = !this.opened;
	}

}
