import { IStateRootScope } from '../../common/directives/state-detector-directive';

interface IAction {
	(region: string): void;
}

interface IScope extends angular.IScope {
	data: string[];
	action: IAction;
	vm: any;
}
/** @ngInject */
export function dropDownMenu(): angular.IDirective {
	return {
		restrict: 'E',
		scope: {
			data: "=",
			action: "="
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

		}
	};
}

/** @ngInject */
export class Controller {
	action: IAction;
	selectedRegion: string;
	data: string[];
	opened: boolean = false;

	constructor() {
		this.selectedRegion = 'Всі регіони';
	}

	select(r) {
		this.opened = false;
		this.selectedRegion = r;
		this.action(r);
	}

	toggle () {
		this.opened = !this.opened;
	}

}
