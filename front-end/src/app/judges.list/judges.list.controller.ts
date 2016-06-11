import { ApiInterface } from '../common/services/api.service'

interface JudgesListInterface {
  allJudges: any[];
}

export class JudgesListController {
  allJudges: any[];
  private _api: any;
  /* @ngInject */
  constructor (Api:ApiInterface) {
    console.log("Helo list");
    this._api = Api;
    this.getData()
  }

  /** @ngInject */
  getData () {
    return this._api.getData()
      .then(res => {
        this.allJudges = res;
      })
      .catch(e => {
        throw new Error(e)
      })
  }

}
