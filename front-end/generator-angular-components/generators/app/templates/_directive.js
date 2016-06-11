/**
 * @ngdoc directive
 * @name BP.<%=_.camelize(moduleName)%>.directive:<%=_.camelize(name)%>
 * @restrict E
 * @description
 * @example
 * <pre>
 * </pre>
 */

/** @ngInject */
export function <%=_.classify(name)%>(): angular.IDirective {
  return {
    restrict: 'E',
    scope: {
      creationDate: '='
    },
    templateUrl: 'app/components/<%=_.dasherize(name).replace("-", "")%>/<%=_.dasherize(name).replace("-", "")%>.view.html',
    controller: <%=_.classify(name)%>Controller,
    controllerAs: 'vm',
    bindToController: true
  };

}

/** @ngInject */
class <%=_.classify(name)%>Controller {

  constructor() {
  }
}




