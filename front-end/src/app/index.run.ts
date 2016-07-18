import { IStateRootScope } from './common/directives/state-detector-directive';
// import {ga} from 'google.analytics/ga';
/** @ngInject */
export function runBlock($log: angular.ILogService, $state: any, $rootScope: IStateRootScope, $window: angular.IWindowService) {
	$rootScope.$on('$stateChangeStart', (e: any, toState: any) => {
		$rootScope.isGradient = toState.name !== 'details';
		$rootScope.currentState = toState.name;
	});
  $rootScope.$on('$stateChangeSuccess', (e: any, toState: any) => {
    $window.ga('set', 'page', toState.url.replace(':key', $state.params.key));
    ga('send', 'pageview');
  });
}
