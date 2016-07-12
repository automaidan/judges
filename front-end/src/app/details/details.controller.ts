// import * as _ from 'lodash';
// interface ITable {
// 	flats: Object
// }

const TABLE_MODEL = {
	head: {
		title: null,
		years: []
	},
	table: {}
};

const countTotal = (arr, field) => {
	return arr.reduce((res, item) => {
		res += item[field].replace(',', '.') && parseFloat(item[field].replace(',', '.'));
		return res;
	}, 0)
};
export class DetailsController {
	declarations: any[];
	$scope: angular.IScope;
	isShown: boolean;
	data: any = {};
	renderedData: any;
	incomeShown: boolean;
	estateShown: boolean;

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
			console.log(data);
			this.incomeShown = this.hasIncomes();
			debugger;
			this.estateShown = this.toShowEstate();
			this.$scope.$apply();
		});
	}

	countInComes() {
		const tableModel = angular.copy(TABLE_MODEL);

		tableModel.table = {
			own:  {
				title: 'Дохід',
				value: []
			},
			family: {
				title: 'Дохід сім\'ї',
				value: []
			}
		};

		this.data.declarations.forEach((item) => {
			tableModel.table.family.value.push(
				item.income[5].family.replace(',', '.')
				&& (parseFloat(item.income[5].family.replace(',', '.')) + 'грн')
			);

			tableModel.table.own.value.push(
				item.income[5].value.replace(',', '.')
				&& (parseFloat(item.income[5].value.replace(',', '.')) + 'грн')
			);
			tableModel.head.title = "Статки";
			tableModel.head.years.push(item.intro.declaration_year);
		}, []);

		return tableModel;
	}

	countRealEstate () {
		const tableModel = angular.copy(TABLE_MODEL);

		tableModel.table = {
			flats:  {
				title: 'Загальна площа власних квартир',
				value: []
			},
			flatsFamily: {
				title: 'Загальна площа квартир родини',
				value: []
			},
			cottages: {
				title: 'Загальна площа житлових будинків',
				value: []
			},
			cottagesFamily: {
				title: 'Загальна площа житлових будинків родини',
				value: []
			},
			parcels: {
				title: 'Земельні ділянки власні',
				value: []
			},
			parcelsFamily: {
				title: 'Земельні ділянки родини',
				value: []
			}

		};

		this.data.declarations.forEach((item) => {
			const totalOwnFlats = item.estate[25] && (countTotal(item.estate[25], 'space') + (item.estate[25][0].space_units || 'м²')),
				totalFamilyFlats = item.estate[31] && (countTotal(item.estate[31], 'space') + item.estate[31][0].space_units || 'м²'),
				totalCottages = item.estate[24] && (countTotal(item.estate[24], 'space') + item.estate[24][0].space_units || 'м²'),
				totalFamilyCottages = item.estate[30] && (countTotal(item.estate[30], 'space') + item.estate[30][0].space_units || 'м²'),
				totalParcel = item.estate[23] && (countTotal(item.estate[23], 'space') + item.estate[23][0].space_units || 'м²'),
				totalFamilyParcels = item.estate[29] && (countTotal(item.estate[29], 'space') + item.estate[29][0].space_units || 'м²');

			tableModel.table.flats.value.push(totalOwnFlats);
			tableModel.table.flatsFamily.value.push(totalFamilyFlats);
			tableModel.table.cottages.value.push(totalCottages);
			tableModel.table.cottagesFamily.value.push(totalFamilyCottages);
			tableModel.table.parcels.value.push(totalParcel);
			tableModel.table.parcelsFamily.value.push(totalFamilyParcels);

			tableModel.head.title = 'Майно';
			tableModel.head.years.push(item.intro.declaration_year);
		}, []);

		return tableModel;
	}

	filterData(key) {
		let _this = this,
			map = {
				'income': () => {return _this.countInComes()},
				'estate': () => {return _this.countRealEstate()}
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
	toShowEstate () {
		debugger;
		return !!((this.data.declarations[1] && this.data.declarations[0].estate)
			|| (this.data.declarations[1] && this.data.declarations[1].estate));
	}
}
