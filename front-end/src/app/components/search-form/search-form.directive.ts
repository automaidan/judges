import {escapeRegExp} from '../../common/helper';
import {ISearchFormController} from './search-form.interfaces';

let TIMER = null;
const SEARCH_RESULT_TIMEOUT = 3000;

interface IScope extends angular.IScope {
    isOpen: boolean;
    vm: ISearchFormController;

}

/** @ngInject */
export function searchForm(): angular.IDirective {

    return {
        restrict: 'E',
        scope: {
            isOpen: '='
        },
        templateUrl: 'app/components/search-form/search-form.view.html',
        controller: SearchFormController,
        controllerAs: 'vm',
        bindToController: true
    };

}

/** @ngInject */
class SearchFormController implements ISearchFormController {
    judges: any[] = [];
    searchQuery: string = '';
    state: any;
    filtered: any[] = [];
    isOpen: boolean;
    private api: any = {};
    private $scope: angular.IScope;
    private $timeout: angular.ITimeoutService;

    constructor(Api: any, $state: any, $scope: IScope, $timeout: angular.ITimeoutService) {
        this.api = Api;
        this.state = $state;
        this.api.getJudgesList().then((res: any[]) => {
            this.judges = res;
        });
        this.$scope = $scope;
        this.$timeout = $timeout;

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
        const regexp = new RegExp('^' + escapeRegExp(this.searchQuery), 'gi');
        for (let item of this.judges) {
            if (filtered.length >= 5) {
                break;
            }
            if (regexp.test(item.n)) {
                filtered.push(item);
            }
        }

        if (filtered.length === 0) {
            filtered.push({n: 'Cуддю не знайдено...', r: ''});
        }

        this.filtered = filtered;
        this.isOpen = this.searchQuery.length > 0;

        if (this.isOpen) {
            if (TIMER) {
                this.clearTimer();
            } else {
                this.setTimer();
            }
        } else {
            this.clearTimer();
        }
    }

    setTimer() {
        TIMER = setTimeout(() => {
            this.isOpen = false;
            this.$scope.$apply();
        }, SEARCH_RESULT_TIMEOUT);
    }

    clearTimer() {
        clearTimeout(TIMER);
        TIMER = null;
    }
}
