
/** @ngInject */
export function navbar(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {
      creationDate: '='
    },
    templateUrl: 'app/components/navbar/navbar.html',
    controller: NavbarController,
    controllerAs: 'vm',
    bindToController: true
  };

}

/** @ngInject */
export class NavbarController {
  menuItems:any[];

  constructor(constants:any) {
    debugger;
    this.menuItems = constants.menuItems;

    debugger;
  }
}
