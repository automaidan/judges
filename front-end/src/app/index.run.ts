import { IStateRootScope } from './common/directives/state-detector-directive';
interface IWindow extends angular.IWindowService {
	ga: any;
}
interface IScope extends angular.IScope {
	global: string;
}

// import {ga} from 'google.analytics/ga';
/** @ngInject */
export function runBlock($log: angular.ILogService, $state: any, $rootScope: IStateRootScope, $window: IWindow) {
	$rootScope.$on('$stateChangeStart', (e: any, toState: any, toParams:any, fromState: any, fromParams: any) => {
		$rootScope.isGradient = toState.name !== 'details';
		$rootScope.currentState = toState.name;
	});
  $rootScope.$on('$stateChangeSuccess', (e: any, toState: any) => {
    $window.ga('set', 'page', toState.url.replace(':key', $state.params.key).replace(':query', $state.params.query));
    ga('send', 'pageview');
  });
}
