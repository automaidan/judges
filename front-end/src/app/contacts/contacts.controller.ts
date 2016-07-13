// import * as _ from 'lodash';

export class DetailsController {
	$scope: angular.IScope;

	private _api: any;
	/* @ngInject */
	constructor($state: any, Api: any, $scope: angular.IScope) {
		console.log('Helo details');
		this._api = Api;
	}

	/** @ngInject */

}
