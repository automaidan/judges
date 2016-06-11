/** @ngInject */
export function routerConfig($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/home/home.view.html',
      controller: 'HomeController',
      controllerAs: 'vm'
    })
    .state('list', {
      url: '/list',
      templateUrl: 'app/judges.list/judges.list.view.html',
      controller: 'JudgesListController',
      controllerAs: 'vm'
    })
    .state('about', {
      url: '/about',
      templateUrl: 'app/about/about.view.html',
      controller: 'AboutController',
      controllerAs: 'vm'
    });

  $urlRouterProvider.otherwise('/');
}
