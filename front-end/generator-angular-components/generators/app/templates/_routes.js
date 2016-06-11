/**
 * @ngdoc object
 * @name BP.<%=_.camelize(moduleName)%>.routes:<%=_.camelize(name)%>Routes
 * @description
 */
'use strict';

export default function ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('BP.<%=_.dasherize(name).replace("-", "").replace(".", "-")%>', {
      url: '/<%=_.dasherize(name).replace(".", "/").replace("-", "")%>',
      templateUrl: 'app/<%=_.dasherize(moduleName).replace(".", "/").replace("-", "")%>.module/views/<%=_.dasherize(name).replace("-", "")%>.view.html',
      controller: '<%=_.camelize(_.dasherize(moduleName).replace("-", "")).replace(".", "")%>Controller',
      controllerAs: 'vm'
    });

  $urlRouterProvider.otherwise('/');
};
