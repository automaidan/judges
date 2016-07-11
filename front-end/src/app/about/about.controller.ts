interface IAboutController {
  texts: any;
  getData(): Promise<any>;
}

class AboutController implements IAboutController {
  texts: any;

  private _api: any;
  /* @ngInject */


  constructor(Api: any) {
    console.log('Hello About');
    this._api = Api;
    this.getData();
  }

  /** @ngInject */
  getData() {
    return this._api.getTexts();
  }
}

export { AboutController };
