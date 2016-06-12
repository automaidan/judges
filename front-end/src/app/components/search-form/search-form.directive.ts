
/** @ngInject */
export function searchForm(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'app/components/search-form/search-form.view.html',
    controller: SearchFormController,
    controllerAs: 'vm',
    bindToController: true,
    link: function () {}
  };

}

/** @ngInject */
class SearchFormController {
  constructor(constants:any) {
    console.log('SearchForm injected!');
  }
}
