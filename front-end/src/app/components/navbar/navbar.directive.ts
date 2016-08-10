import { IStateRootScope } from '../../common/directives/state-detector-directive';
interface IScope extends angular.IScope {
  vm: any;
}
/** @ngInject */
export function navbar(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'app/components/navbar/navbar.html',
    controller: NavbarController,
    controllerAs: 'vm',
    bindToController: true,
    link: (scope: IScope, element: angular.IAugmentedJQuery) => {
      let toggle = element.find('.navbar__menu_toggle'),
          container = toggle.parent();

      angular.element(toggle).on('click', () => {
        container.toggleClass('open');
      });

      scope.$watch(() => {
        return scope.vm.$rootscope.currentState;
      }, () => {
        container.removeClass('open');
        scope.vm.activeTab = scope.vm.$rootscope.currentState;
      });
    }
  };

}

/** @ngInject */
export class NavbarController {
  menuItems: any[];
  activeTab: any;
  $rootscope: any;

  constructor(navbarConstant: any, $rootScope: IStateRootScope) {
    this.menuItems = navbarConstant;
    this.$rootscope = $rootScope;
  }

}
