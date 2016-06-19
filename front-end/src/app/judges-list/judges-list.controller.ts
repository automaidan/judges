// import { IApi } from '../common/services/api.service';

const DISPLAYING_LENGTH: number = 25;

interface IJudgesListInterface {
  allJudges: any[];
  getData(): void;
}

export class JudgesListController {
  allJudges: any[] = [];
  dtColumnDefs: any[];
  dtOptions: any;
  private _api: any;
  dictionary: any;

  /* @ngInject */
  constructor(Api: any, DTOptionsBuilder: any, DTColumnDefBuilder: any, $scope: angular.IScope) {
    console.log('Hello list');
    const VM = this;

    let _judges = this.allJudges;

    this._api = Api;
    this.getData();

    this.dtOptions = {
      paginationType: 'full_numbers',
      displayLength: DISPLAYING_LENGTH
    };

    this.dtColumnDefs = [
      DTColumnDefBuilder.newColumnDef(0),
      DTColumnDefBuilder.newColumnDef(1),
      DTColumnDefBuilder.newColumnDef(2)
    ];
    debugger;

    $scope.$watch(angular.bind(this, () => {
      return _judges;
    }), (newVal) => {
      _judges = newVal;
    });
  }

  /** @ngInject */
  getData() {
    console.log('judges loaded');
    return this._api.getData()
      .then((res) => {
        this.allJudges = res[1];
        this.dictionary = res[0];
      })
      .catch((e: any) => {
        throw new Error(`${e.status }, ${e.statusText}`);
      });
  }
}
