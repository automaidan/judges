/** @ngInject */
export function routerConfig($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'app/home/home.view.html',
            controller: 'HomeController',
            controllerAs: 'vm'
        })
        .state('judges', {
            url: '/judges/:query',
            templateUrl: 'app/list/list.view.html',
            controller: 'JudgesListController',
            controllerAs: 'vm'
        })
        .state('prosecutors', {
            url: '/prosecutors/:query',
            templateUrl: 'app/list/list.view.html',
            controller: 'JudgesListController',
            controllerAs: 'vm'
        })
        .state('about', {
            url: '/about',
            templateUrl: 'app/about/about.view.html',
            controller: 'AboutController',
            controllerAs: 'vm'
        })
        .state('details', {
            url: '/profiles/:key',
            templateUrl: 'app/details/details.view.html',
            controller: 'DetailsController',
            controllerAs: 'vm'
        })
        .state('contacts', {
            url: '/contacts',
            templateUrl: 'app/contacts/contacts.view.html',
            controller: 'ContactUsController',
            controllerAs: 'vm'
        })
        .state('analytics', {
            url: '/analytics?query',
            templateUrl: 'app/analytics/analytics.view.html',
            controller: 'AnalyticsController',
            controllerAs: 'vm',
            reloadOnSearch: false
        });

    $urlRouterProvider.otherwise('/');
}
