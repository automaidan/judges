// import { IApi } from '../../common/services/api.service';
/** @ngInject */
export function searchForm(): angular.IDirective {

  return {
    restrict : 'E',
    scope : {},
    templateUrl : 'app/components/search-form/search-form.view.html',
    controller : SearchFormController,
    controllerAs : 'vm',
    bindToController : true,
    link : function () {
    }
  };

}

interface ISearchFormController {
  searchResult: any[];
  judges: any[];
  api: any;
  searchQuery: string ;
  findData(): void;
}
/** @ngInject */
class SearchFormController implements ISearchFormController {
  searchResult: any[] = [];
  judges: any[] = [];
  api: any = {};
  searchQuery: string = '';

  constructor(Api: any) {
    console.log('SearchForm injected!');
    this.api = Storage;
    // this.api.getData().then((res: any[]) => {
    //   this.judges = res;
    // });
  }

  findData() {

  }
}
