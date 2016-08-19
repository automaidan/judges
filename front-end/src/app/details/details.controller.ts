import { isEmpty } from 'lodash';
import { ITableBodyRowModel, ITableModel } from './details.interfaces';

const TABLE_MODEL: ITableModel = {
	head: {
		title: '',
		years: []
	},
	body: []
};

const countTotal = (arr: any[], field: string) => {
	return arr.reduce((res: number, item: Object) => {
		res += item[field].replace(',', '.') && parseFloat(item[field].replace(',', '.'));
		return Number(res);
	}, 0).toFixed(2);
};

export class DetailsController {
	declarations: any[];
	$scope: angular.IScope;
	isShown: boolean;
	data: any = {};
	renderedData: any;
	incomeShown: boolean;
	estateShown: boolean;
	avatar: string;

	private _api: any;

	/** @ngInject */
	constructor($state: any, Api: any, $scope: angular.IScope) {
		this._api = Api;
		this.getDetails($state.params.key);
		this.$scope = $scope;
		this.isShown = false;
	}

	/** @ngInject */
	getDetails(key: string) {
		return this._api.getOne(key).then((data: any) => {
			const photoKey: string = 'Фото';
			this.data = data;
			this.data.declarations.reverse();
			this.incomeShown = this.hasIncomes();
			this.estateShown = this.toShowEstate();
			this.avatar = this.data[photoKey] || '../../assets/images/profile_photo_3.png';
			this.$scope.$apply();
			console.log(data);
		});
	}

	countInComes() {
		const tableModel = angular.copy(TABLE_MODEL);
		const ownIncomes: ITableBodyRowModel = {
			title: 'Дохід',
			valueByYears: []
		};
		const familyIncomes: ITableBodyRowModel = {
			title: 'Дохід сім\'ї',
			valueByYears: []
		};

		this.data.declarations.forEach((item: any) => {
			let _familyIncomes = (item.income[5].family)
				? item.income[5].family.replace(',', '.') && (parseFloat(item.income[5].family.replace(',', '.')) + ' грн')
				: '-';
			let _ownIncomes = (item.income[5].value)
				? item.income[5].value.replace(',', '.') && (parseFloat(item.income[5].value.replace(',', '.')) + ' грн')
				: '-';

			familyIncomes.valueByYears.push(_familyIncomes);
			ownIncomes.valueByYears.push(_ownIncomes);

			tableModel.head.title = 'Доходи';
			tableModel.head.years.push(item.intro.declaration_year);
		}, []);


		tableModel.body.push(ownIncomes);
		tableModel.body.push(familyIncomes);

		return tableModel;
	}

	countRealEstate() {
		const tableModel = angular.copy(TABLE_MODEL);
		const flats: ITableBodyRowModel = {
			title: 'Загальна площа власних квартир',
			valueByYears: []
		};
		const flatsFamily: ITableBodyRowModel = {
			title: 'Загальна площа квартир родини',
			valueByYears: []
		};
		const cottages: ITableBodyRowModel = {
			title: 'Загальна площа житлових будинків',
			valueByYears: []
		};
		const cottagesFamily: ITableBodyRowModel = {
			title: 'Загальна площа житлових будинків родини',
			valueByYears: []
		};
		const parcels: ITableBodyRowModel = {
			title: 'Земельні ділянки власні',
			valueByYears: []
		};
		const parcelsFamily: ITableBodyRowModel = {
			title: 'Земельні ділянки родини',
			valueByYears: []
		};

		this.data.declarations.forEach((item: any) => {
			const totalOwnFlats = (item.estate[25])
					? countTotal(item.estate[25], 'space') + (item.estate[25][0].space_units || ' м²')
					: '-',
				totalFamilyFlats = (item.estate[31])
					? countTotal(item.estate[31], 'space') + (item.estate[31][0].space_units || ' м²')
					: '-',
				totalCottages = (item.estate[24])
					? countTotal(item.estate[24], 'space') + (item.estate[24][0].space_units || ' м²')
					: '-',
				totalFamilyCottages = item.estate[30]
					? countTotal(item.estate[30], 'space') + (item.estate[30][0].space_units || ' м²')
					: '-',
				totalParcel = item.estate[23]
					? countTotal(item.estate[23], 'space') + (item.estate[23][0].space_units || ' м²')
					: '-',
				totalFamilyParcels = item.estate[29]
					? countTotal(item.estate[29], 'space') + (item.estate[29][0].space_units || ' м²')
					: '-';

			flats.valueByYears.push(totalOwnFlats);
			flatsFamily.valueByYears.push(totalFamilyFlats);
			cottages.valueByYears.push(totalCottages);
			cottagesFamily.valueByYears.push(totalFamilyCottages);
			parcels.valueByYears.push(totalParcel);
			parcelsFamily.valueByYears.push(totalFamilyParcels);

			tableModel.head.title = 'Майно';
			tableModel.head.years.push(item.intro.declaration_year);
		}, []);

		if (!isEmpty(flats.valueByYears)) {
            tableModel.body.push(flats);
        }
        if (!isEmpty(flatsFamily.valueByYears)) {
            tableModel.body.push(flatsFamily);
        }
        if (!isEmpty(cottages.valueByYears)) {
            tableModel.body.push(cottages);
        }
        if (!isEmpty(cottagesFamily.valueByYears)) {
            tableModel.body.push(cottagesFamily);
        }
        if (!isEmpty(parcels.valueByYears)) {
            tableModel.body.push(parcels);
        }
        if (!isEmpty(parcelsFamily.valueByYears)) {
            tableModel.body.push(parcelsFamily);
        }

		return tableModel;
	}

	// countVihcles () {
	// 	const tableModel = angular.copy(TABLE_MODEL);
	// 	const carsOwn: ITableBodyRowModel = {
	// 		title: 'Легкові авто власні',
	// 		valueByYears: []
	// 	};
	//
	// 	this.data.declarations.forEach((item) => {
	//
	// 	});
	//
	//
	// }

	//
	countSues() {
		const tableModel = angular.copy(TABLE_MODEL);
		const allSues: ITableBodyRowModel = {
			title: 'Загальна кількість справ',
			valueByYears: []
		};
		const appelationCount: ITableBodyRowModel = {
			title: 'Кількість скарг',
			valueByYears: []
		};
		const appealed: ITableBodyRowModel = {
			title: 'Оскаржені справи',
			valueByYears: []
		};
		const disciplinFears: ITableBodyRowModel = {
			title: 'Кількість дисциплінарних стягнень',
			valueByYears: []
		};

		allSues.valueByYears.push(this.data['Кількість справ']);
		appelationCount.valueByYears.push(this.data['Кількість скарг']);
		appealed.valueByYears.push(this.data['Оскаржені']);
		disciplinFears.valueByYears.push(this.data['Кількість дисциплінарних стягнень']);

        if (!isEmpty(allSues.valueByYears)) {
            tableModel.body.push(allSues);
        }
        if (!isEmpty(appelationCount.valueByYears)) {
            tableModel.body.push(appelationCount);
        }
        if (!isEmpty(appealed.valueByYears)) {
            tableModel.body.push(appealed);
        }
        if (!isEmpty(disciplinFears.valueByYears)) {
            tableModel.body.push(disciplinFears);
        }

		tableModel.head.title = 'Професійні показники';

		return tableModel;
	}

	filterData(key: any) {
		let _this = this,
			map = {
				'income': () => {
					return _this.countInComes();
				},
				'estate': () => {
					return _this.countRealEstate();
				},
				'sues': () => {
					return _this.countSues();
				}
			};

		this.toRenderData(map[key]());
	}

	toRenderData(renderData: any) {
		this.isShown = true;
		this.renderedData = renderData;
	}

	hasIncomes() {
		return !isEmpty(this.data.declarations) && !!(this.data.declarations[0].income[5].value || this.data.declarations[0].income[5].family);
	}

	toShowEstate() {
		return !!((this.data.declarations[0] && this.data.declarations[0].estate)
		|| (this.data.declarations[1] && this.data.declarations[1].estate));
	}

	showAntiMaidan() {
		return this.data['Клейма'] === 1 || this.data['Клейма'] === 12;
	}

	showPoliticalPrisoners() {
		return this.data['Клейма'] === 2 || this.data['Клейма'] === 12;
	}
}
