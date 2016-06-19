// import { IApi } from '../common/services/api.service';

const DISPLAYING_LENGTH: number = 25;

interface IJudgesListInterface {
  allJudges: any[];
  getData(): void;
}

export class JudgesListController {
  private _api: any;
  data: any = {dictionary: {}, allJudges: []};

  /* @ngInject */
  constructor(Api: any, DTOptionsBuilder: any, DTColumnDefBuilder: any) {
    console.log('Hello list');
  
    this._api = Api;
    this.getData();
  }

  /** @ngInject */
  getData() {
    console.log('judges loaded');
    return this._api.getData()
      .then((res) => {
        this.data.dictionary = res[0];
        this.data.allJudges = res[1];
      })
      .catch((e: any) => {
        throw new Error(`${e.status }, ${e.statusText}`);
      });
  }
}
