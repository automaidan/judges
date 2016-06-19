/** @ngInject */
export function list(): angular.IDirective {

  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    templateUrl: 'app/components/list/judges-list.view.html',
    controller: JudgesListController,
    controllerAs: 'vm',
    bindToController: true
  };

}
const DISPLAYING_LENGTH: number = 25;
/** @ngInject */

export class JudgesListController {
  private _api: any;
  private _state: any;
  private _detailsUrl: string;
  data: any;

  allJudges: any[];
  dtColumnDefs: any[];
  dtOptions: any;
  dictionary: any;

  constructor(DTOptionsBuilder: any, DTColumnDefBuilder: any, $scope: angular.IScope, $state: any, urls: any) {
    let vm = this;
    this._detailsUrl = urls.details;
    this._state = $state;

    this.dtOptions = {
      paginationType: 'full_numbers',
      displayLength: DISPLAYING_LENGTH
    };

    this.dtColumnDefs = [
      DTColumnDefBuilder.newColumnDef(0),
      DTColumnDefBuilder.newColumnDef(1),
      DTColumnDefBuilder.newColumnDef(2)
    ];

    // $scope.$watch(() => {
    //   return this.data;
    // }, (newVal) => {
    //   debugger;
    //   if(newVal && newVal.allJudges.length !== 0) {
    //     vm.data = newVal;
    //   }
    //
    // })
  }

  toDetails(key) {
    console.log('Before reload');
    this._state.go('details', {key});
  }

}
