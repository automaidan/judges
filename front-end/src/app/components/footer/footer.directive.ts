/** @ngInject */
export function footer(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {
      creationDate: '='
    },
    templateUrl: 'app/components/footer/footer.html',
    controller: FooterController,
    controllerAs: 'vm',
    bindToController: true
  };

}

/** @ngInject */
export class FooterController {

  constructor($location: angular.ILocationProvider) {
    // $scope.$watch(() => {
    //   return this.activeTab;
    // }, (newVal) => {
    //   debugger;
    //   console.log(vm);
    // })
  }

}
