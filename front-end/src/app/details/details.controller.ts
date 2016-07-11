export class DetailsController {
	declarations: any[];
	$scope: angular.IScope;
	detail_info: any;
	isShown: boolean;
	data: any;
	renderedData: any;
	private _api: any;
	/* @ngInject */
	constructor($state: any, Api: any, $scope: angular.IScope) {
		console.log('Helo details');
		this._api = Api;
		this.getDetails($state.params.key);
		this.$scope = $scope;
		this.isShown = false;
	}

	/** @ngInject */
	getDetails(key: string) {
		return this._api.getOne(key).then((data: any) => {
			this.data = data;
			this.$scope.$apply();
		});
	}

	filterData(key) {
		let renderedData = this.data.declarations.map((item) => {
			let filteredData = {};
			filteredData[key] = angular.copy(item[key]);
			return filteredData;
		});
		this.toRenderData(key);
	}

	toRenderData(renderData: any) {
		this.isShown = true;
		this.renderedData = renderData;
	}
}
