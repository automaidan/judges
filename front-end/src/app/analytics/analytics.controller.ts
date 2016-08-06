import * as d3 from 'd3';

interface IAnalyticsController {
	getData(): void;
}

class AnalyticsController implements IAnalyticsController {
	private $scope: any;
	public data: any[];
	public filterByYear: any = [2013, 2014];
	public filterByRegion: any = ['test', 'test'];
	public filterByDepartments: any = ['department1', 'department2'];
	public filterByIncomes: any = [];
	private _api: any;
	/* @ngInject */


	constructor(Api: any, $scope: angular.IScope) {
		this._api = Api;
		this.$scope = $scope;

		// this.getData();
	}

	/** @ngInject */
	getData() {

	}
}

export { AnalyticsController };
