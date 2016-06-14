import { ApiInterface } from '../common/services/api.service';

const DISPLAYING_LENGTH:number = 25;

interface JudgesListInterface {
  allJudges: any[];
}

export class JudgesListController {
  allJudges:any[];
  dtColumnDefs:any[];
  dtOptions:any;
  private _api:any;

  /* @ngInject */
  constructor(Api:ApiInterface, DTOptionsBuilder:any, DTColumnDefBuilder:any) {
    console.log('Hello list');
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
  }

  /** @ngInject */
  getData() {
    console.log('judges loaded');
    return this._api.getData()
      .then(res => {
        this.allJudges = res;
      })
      .catch(e => {
        throw new Error(`${e.status }, ${e.statusText}`);
      });
  }
}
