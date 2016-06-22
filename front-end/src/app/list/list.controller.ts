// import { IApi } from '../common/services/api.service';

// const DISPLAYING_LENGTH: number = 25;

interface IJudgesListInterface {
  allJudges: any[];
  getData(): void;
}

export class JudgesListController {
  data: any;

  private _api: any;

  /* @ngInject */
  constructor(Api: any) {
    console.log('Hello list');

    this._api = Api;
    this.getData();
  }

  /** @ngInject */
  getData() {
    console.log('judges loaded');
    return this._api.getData()
      .then((res: any) => {
        this.data = res;
      })
      .catch((e: any) => {
        throw new Error(`${e.status }, ${e.statusText}`);
      });
  }
}
