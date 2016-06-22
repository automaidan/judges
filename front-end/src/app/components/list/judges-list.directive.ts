/** @ngInject */
export function list(): angular.IDirective {

	return {
		restrict: 'E',
		scope: {},
		templateUrl: 'app/components/list/judges-list.view.html',
		controller: JudgesListController,
		controllerAs: 'vm',
		bindToController: true
	};

}
// const DISPLAYING_LENGTH: number = 25;
/** @ngInject */

export class JudgesListController {
	dtInstance: any;
	dtColumnDefs: any[];
	dtOptions: any;
	dictionary: any;

	private _state: any;
	private _detailsUrl: string;
	private _api: any;


	constructor(Api: any, DTColumnBuilder: any, $state: any, urls: any, DTOptionsBuilder: any) {
		this._detailsUrl = urls.details;
		this._state = $state;
		this._api = Api;
		this.dtOptions = DTOptionsBuilder.fromFnPromise(() => {
			return this._api.getData().then((res) => {
				return res;
			});
		}).withPaginationType('full_numbers');

		this.dtInstance = {};

		this.dtColumnDefs = [
			DTColumnBuilder.newColumn('n').withTitle("Ім'я"),
			DTColumnBuilder.newColumn('d').withTitle('Департамент'),
			DTColumnBuilder.newColumn('r').withTitle('Регіон')
		];

	}

	toDetails(key: string) {
		console.log('Before reload');
		this._state.go('details', {key});
	}

}
