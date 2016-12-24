import {isEmpty, fill, clone, includes, has} from 'lodash';
import {ITableBodyRowModel, ITableModel} from './details.interfaces';

const ANALYTICS_MODEL = {
    'year': 'y',
    'bankAccount': 'b',
    'cash': 'm',
    'complaintAmount': 'w',
    'complainsAmount': 'j',
    'income': 'i',
    'carAmount': 'c',
    'flatArea': 'k',
    'flatAmount': 'ka',
    'houseArea': 'h',
    'houseAmount': 'ha',
    'landArea': 'l',
    'landAmount': 'la',
    'familyIncome': 'fi',
    'familyCarAmount': 'fc',
    'familyFlatArea': 'ff',
    'familyFlatAmount': 'ffa',
    'familyHouseArea': 'fh',
    'familyHouseAmount': 'fha',
    'familyLandArea': 'fl',
    'familyLandAmount': 'fla'
};

const TABLE_MODEL: ITableModel = {
    head: {
        title: '',
        years: []
    },
    body: []
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

        this.data.analytics.forEach((item: any) => {
            const _familyIncomes =
                has(item, ANALYTICS_MODEL.familyIncome) ? item[ANALYTICS_MODEL.familyIncome] + ' ₴' : '-';
            const _ownIncomes =
                has(item, ANALYTICS_MODEL.income) ? item[ANALYTICS_MODEL.income] + ' ₴' : '-';

            familyIncomes.valueByYears.push(_familyIncomes);
            ownIncomes.valueByYears.push(_ownIncomes);

            tableModel.head.title = 'Доходи';
            tableModel.head.years.push(item[ANALYTICS_MODEL.year]);
        }, []);


        tableModel.body.push(ownIncomes);
        tableModel.body.push(familyIncomes);

        return tableModel;
    }

    countRealEstate() {
        const tableModel = angular.copy(TABLE_MODEL);
        const flats: ITableBodyRowModel = {
            title: 'Загальна площа квартир',
            valueByYears: []
        };
        const flatsFamily: ITableBodyRowModel = {
            title: 'Загальна площа квартир',
            valueByYears: []
        };
        const cottages: ITableBodyRowModel = {
            title: 'Загальна площа житлових будинків',
            valueByYears: []
        };
        const cottagesFamily: ITableBodyRowModel = {
            title: 'Загальна площа житлових будинків',
            valueByYears: []
        };
        const parcels: ITableBodyRowModel = {
            title: 'Земельні ділянки',
            valueByYears: []
        };
        const parcelsFamily: ITableBodyRowModel = {
            title: 'Земельні ділянки',
            valueByYears: []
        };

        this.data.analytics.forEach((item: any) => {
            const totalOwnFlats =
                has(item, ANALYTICS_MODEL.flatArea) ? item[ANALYTICS_MODEL.flatArea] + ' м²' : '-';
            const totalFamilyFlats =
                has(item, ANALYTICS_MODEL.familyFlatArea) ? item[ANALYTICS_MODEL.familyFlatArea] + ' м²' : '-';
            const totalCottages =
                has(item, ANALYTICS_MODEL.houseArea) ? item[ANALYTICS_MODEL.houseArea] + ' м²' : '-';
            const totalFamilyCottages =
                has(item, ANALYTICS_MODEL.familyHouseArea) ? item[ANALYTICS_MODEL.familyHouseArea] + ' м²' : '-';
            const totalParcel =
                has(item, ANALYTICS_MODEL.landArea) ? item[ANALYTICS_MODEL.landArea] + ' м²' : '-';
            const totalFamilyParcels =
                has(item, ANALYTICS_MODEL.familyLandArea) ? item[ANALYTICS_MODEL.familyLandArea] + ' м²' : '-';

            flats.valueByYears.push(totalOwnFlats);
            flatsFamily.valueByYears.push(totalFamilyFlats);
            cottages.valueByYears.push(totalCottages);
            cottagesFamily.valueByYears.push(totalFamilyCottages);
            parcels.valueByYears.push(totalParcel);
            parcelsFamily.valueByYears.push(totalFamilyParcels);

            tableModel.head.title = 'Майно';
            tableModel.head.years.push(item[ANALYTICS_MODEL.year]);
        }, []);

        if (!isEmpty(flats.valueByYears) || !isEmpty(cottages.valueByYears) || !isEmpty(parcels.valueByYears)) {
            tableModel.body.push({
                title: 'Власні:',
                valueByYears: fill(clone(flats.valueByYears), ' ')
            });
        }
        if (!isEmpty(flats.valueByYears)) {
            tableModel.body.push(flats);
        }
        if (!isEmpty(cottages.valueByYears)) {
            tableModel.body.push(cottages);
        }
        if (!isEmpty(parcels.valueByYears)) {
            tableModel.body.push(parcels);
        }
        if (!isEmpty(flatsFamily.valueByYears) || !isEmpty(cottagesFamily.valueByYears) || !isEmpty(parcelsFamily.valueByYears)) {
            tableModel.body.push({
                title: 'Родини:',
                valueByYears: fill(clone(flats.valueByYears), ' ')
            });
        }
        if (!isEmpty(flatsFamily.valueByYears)) {
            tableModel.body.push(flatsFamily);
        }
        if (!isEmpty(cottagesFamily.valueByYears)) {
            tableModel.body.push(cottagesFamily);
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

    showAntiMaydanStigma() {
        return includes('' + this.data['Клейма'], '1');
    }

    showPoliticalPrisonersStigma() {
        return includes('' + this.data['Клейма'], '2');
    }

    showRetiredStigma() {
        return includes('' + this.data['Клейма'], '3');
    }

    showDecampStigma() {
        return includes('' + this.data['Клейма'], '4');
    }

    showGotTheBootStigma() {
        return includes('' + this.data['Клейма'], '5');
    }
}
