import { IStateRootScope } from './common/directives/state-detector-directive';
/** @ngInject */
export function runBlock($log: angular.ILogService, $state: any, $rootScope: IStateRootScope) {
	$rootScope.$on('$stateChangeStart', (e: any, toState: any) => {
		$rootScope.isGradient = toState.name !== 'details';
		$rootScope.currentState = toState.name;
	});
}
