import * as _ from 'lodash';

export class DetailsController {
	declarations: any[];
	$scope: angular.IScope;
	isShown: boolean;
	data: any = {};
	renderedData: any;
	incomeShown: boolean;

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
			this.incomeShown = this.hasIncomes();
			this.$scope.$apply();

		});
	}

	countInComes() {
		const tableModel = {
			head: {
				title: 'Cтатки',
				years: []
			},
			table: {
				own:  {
					title: 'Дохід',
					value: []
				},
				family: {
					title: 'Дохід сім\'ї',
					value: []
				}
			}
		};

		this.data.declarations.forEach((item) => {
			tableModel.table.family.value.push(item.income[5].family.replace(',', '.') && parseFloat(item.income[5].family.replace(',', '.')));
			tableModel.table.own.value.push(item.income[5].value.replace(',', '.') && parseFloat(item.income[5].value.replace(',', '.')));
			tableModel.head.years.push(item.intro.declaration_year);
		}, []);

		return tableModel;
	}

	filterData(key) {
		let _this = this,
			map = {
				'income': () => {return _this.countInComes()}
			};

		this.toRenderData(map[key]());
	}

	toRenderData(renderData: any) {
		this.isShown = true;
		this.renderedData = renderData;
	}

	hasIncomes () {
		return !!(this.data.declarations[0].income[5].value || this.data.declarations[0].income[5].family)
	}
}
