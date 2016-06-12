import { ApiInterface } from '../../common/services/api.service';
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
  searchResult:any[] = [];
  judges:any[] = [];
  api:any = {};
  searchQuery:string = '';

  constructor(constants:any, Api:ApiInterface) {
    console.log('SearchForm injected!');
    this.api = Api;
    this.api.getData().then(res => {
      debugger;
      this.judges = res;
    });

  }
  findData () {

  }
}
