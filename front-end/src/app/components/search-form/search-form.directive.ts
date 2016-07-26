import { ISearchFormController } from './search-form.interfaces';

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

/** @ngInject */
class SearchFormController implements ISearchFormController {
	judges: any[] = [];
	api: any = {};
	searchQuery: string = '';
	state: any;
	filtered: any[] = [];
	scope: angular.IScope;

	constructor(Api: any, $state: any, $scope: angular.IScope) {
		this.api = Api;
		this.state = $state;
		this.api.getData().then((res: any[]) => {
			this.judges = res;
		});
		this.scope = $scope;
	}

	search(query: string) {
		if (query.length !== 0) {
			this.state.go('list', {query});
		}
	}

	submit() {
		this.search(this.searchQuery);
	}

	openDetails(key: string) {
		if (key) {
			this.state.go('details', {key});
		}
	}

	predicate() {
		const filtered = [];
		const regexp = new RegExp('^' + this.searchQuery, 'gi');
		for (let item of this.judges) {
			if (filtered.length >= 5) {
				break;
			}
			regexp.test(item.n) && filtered.push(item);
		}

		if (filtered.length === 0) {
			filtered.push({n: 'Cуддю не знайдено...', r: ''});
		}

		this.filtered = filtered;
	}
}
