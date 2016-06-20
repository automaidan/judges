export class DetailsController {
  declarations: any[];
  private _api: any;
  /* @ngInject */
  constructor($state: any, Api: any) {
    console.log('Helo details');
    this._api = Api;
    this.getDetails($state.params.key);
  }

  /** @ngInject */
  getDetails(key: string) {
    return this._api.getOne(key).then((data: any) => {
      console.log(data);
      this.declarations = data;
    });
  }
}
