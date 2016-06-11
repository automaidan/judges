/**
 * @ngdoc overview
 * @name  BP.<%=_.dasherize(moduleName).replace(".", "-")%>
 * @requires ui.router
 * @description
 */
import <%=_.camelize(moduleName).replace(".", "")%>Routes from './configs/<%=_.dasherize(name).replace("-", "").replace("-", "")%>.routes';
import <%=_.camelize(moduleName).replace(".", "")%>Config from './configs/<%=_.dasherize(name).replace("-", "").replace("-", "")%>.config';
import <%=_.camelize(moduleName).replace(".", "")%>Controller from './controllers/<%=_.dasherize(name).replace("-", "").replace("-", "")%>.controller';
import <%=_.camelize(moduleName).replace(".", "")%>Service from './services/<%=_.dasherize(name).replace("-", "").replace("-", "")%>.service';
import <%=_.camelize(moduleName).replace(".", "")%>Model from './services/<%=_.dasherize(name).replace("-", "").replace("-", "")%>.model';
import <%=_.camelize(moduleName).replace(".", "")%>Directive from './directives/<%=_.dasherize(name).replace("-", "").replace("-", "")%>.directive';

export default angular.module('BP.<%=_.dasherize(moduleName).replace("-", "").replace("-", "")%>', [])
  .controller('<%=_.camelize(_.dasherize(moduleName).replace("-", "")).replace(".", "")%>Controller', <%=_.camelize(moduleName).replace(".", "")%>Controller)
  .service('<%=_.camelize(_.dasherize(moduleName).replace("-", "")).replace(".", "")%>Service', <%=_.camelize(moduleName).replace(".", "")%>Service)
  .service('<%=_.camelize(_.dasherize(moduleName).replace("-", "")).replace(".", "")%>Model', <%=_.camelize(moduleName).replace(".", "")%>Model)
  .directive('<%=_.camelize(_.dasherize(moduleName).replace("-", "")).replace("common.", "")%>Directive', <%=_.camelize(moduleName).replace(".", "")%>Directive)
  .config(<%=_.camelize(moduleName).replace(".", "")%>Routes)
  .constant('<%=_.camelize(_.dasherize(moduleName).replace("-", "")).replace(".", "")%>Config', <%=_.camelize(moduleName).replace(".", "")%>Config)
  .name;
