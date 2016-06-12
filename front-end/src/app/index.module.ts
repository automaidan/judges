/// <reference path="../../typings/index.d.ts" />

import { routerConfig } from './index.route';
import { runBlock } from './index.run';

import { navbar } from './components/navbar/navbar.directive';
import { searchForm } from './components/search-form/search-form.directive';

import { JudgesListController } from './judges-list/judges-list.controller';
import { HomeController } from './home/home.controller';
import { AboutController } from './about/about.controller';

import { Api } from './common/services/api.service';
import constants from './common/constants/constants';

declare var malarkey: any;
declare var moment: moment.MomentStatic;

module frontEnd {
  'use strict';

  angular.module('frontEnd', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ui.router', 'ngMaterial', 'toastr', 'datatables'])
    .constant('constants', constants)
    .config(routerConfig)
    .run(runBlock)
    .service('Api', Api)
    .controller('JudgesListController', JudgesListController)
    .controller('HomeController', HomeController)
    .controller('AboutController', AboutController)
    .directive('navbar', navbar)
    .directive('searchForm', searchForm);
}
