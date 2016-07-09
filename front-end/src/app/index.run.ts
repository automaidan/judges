import {IStateRootScope} from './common/directives/state-detector-directive';
/** @ngInject */
export function runBlock($log: angular.ILogService, $state: any, $rootScope: IStateRootScope) {
  debugger;

  $rootScope.$on('$stateChangeStart', (e, toState, toParams, fromState, fromParams) => {
    $rootScope.isGradient = toState.name === 'home' ||  toState.name ===  'list';

  })
}
