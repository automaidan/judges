// import { IApi } from '../../common/services/api.service';
/** @ngInject */
export function searchForm(): angular.IDirective {

	return {
		restrict: 'E',
		scope: {},
		templateUrl: 'app/components/search-form/search-form.view.html',
		controller: SearchFormController,
		controllerAs: 'vm',
		bindToController: true
	};

}

interface ISearchFormController {
	judges: any[];
	api: any;
	searchQuery: string;
	state?: any;
}
/** @ngInject */
class SearchFormController implements ISearchFormController {
	judges: any[] = [];
	api: any = {};
	searchQuery: string = '';
	state: any;

	constructor(Api: any, $state: any) {
		console.log('SearchForm injected!');
		this.api = Storage;
		this.state = $state;
	}

	search() {
		if (this.searchQuery.length !== 0) {
			this.state.go('list', {query: this.searchQuery});
		}
	}

	submit() {
		this.search();
	}
}
