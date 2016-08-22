/// <reference path="../../typings/index.d.ts" />

import { routerConfig } from './index.route';
import { runBlock } from './index.run';

import { navbar } from './components/navbar/navbar.directive';
import { list } from './components/list/judges-list.directive';
import { searchForm } from './components/search-form/search-form.directive';
import { footer } from './components/footer/footer.directive';
import { modalTable } from './components/modal-table/modal-table.directive';
import { dropDownMenu } from './components/drop-down-menu/drop-down-menu.directive';

import { JudgesListController } from './list/list.controller';
import { DetailsController } from './details/details.controller';
import { HomeController } from './home/home.controller';
import { AboutController } from './about/about.controller';
import { AnalyticsController } from './analytics/analytics.controller';
import { ContactUs } from './contacts/contacts.controller';

import { StateDetector } from './common/directives/state-detector-directive';

import { Api } from './common/services/api';

import { URLS, NAVBAR } from './common/constants/constants';

import { filterByField,
	filterSearch,
	filterAvailableDepartments,
	filterByYear,
	filterByAnalyticsField } from './common/filters/filters';


module frontEnd {
	'use strict';

	angular.module('frontEnd', [
		'ngAnimate',
		'ngCookies',
		'ngTouch',
		'ngSanitize',
		'ngMessages',
		'ngAria',
		'ui.router',
		'ngMaterial',
		'angularCharts'])
		.constant('urls', URLS)
		.constant('navbarConstant', NAVBAR)
		.config(routerConfig)
		.run(runBlock)
		.service('Api', Api)
		.controller('JudgesListController', JudgesListController)
		.controller('HomeController', HomeController)
		.controller('AboutController', AboutController)
		.controller('DetailsController', DetailsController)
		.controller('ContactUsController', ContactUs)
		.controller('AnalyticsController', AnalyticsController)
		.directive('navbar', navbar)
		.directive('footer', footer)
		.directive('list', list)
		.directive('searchForm', searchForm)
		.directive('stateDetector', StateDetector)
		.directive('modalTable', modalTable)
		.directive('dropDownMenu', dropDownMenu)
		.filter('filterByField', filterByField)
		.filter('filterSearch', filterSearch)
		.filter('filterByYear', filterByYear)
		.filter('filterByAnalyticsField', filterByAnalyticsField)
		.filter('filterAvailableDepartments', filterAvailableDepartments);
}
