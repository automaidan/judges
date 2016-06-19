export class DetailsController {
  details: any = {};

  /* @ngInject */
  constructor($state: any, Api: any) {
    console.log('Helo details');
    debugger;
    Api.getOne($state.params.key).then((data: any) => {
      this.details = data;
    });

  }

  /** @ngInject */

}
