angular.module('stockApp')
  .config(function ($stateProvider, $urlRouterProvider) {

    const stockPath = 'pages/stock';


    $urlRouterProvider.otherwise('/app/stock-price');

    $stateProvider
      .state('app', {
        url: '/app',
        // abstract: true,
        views: {
          'sidenav': {
            templateUrl: '/pages/sidenav/app-sidenav.html',
            controller: 'sidenavController',
            controllerAs: 'sidenavCtrl'
          },
          'main': {
            templateUrl: '/pages/app-container.html',
            controller: 'stockController',
            controllerAs: 'stockCtrl'
          }
        }
      })
      .state('app.stockPrice', {
        url: '/stock-price',
        templateUrl: '/pages/stock/partials/stock-prices.html',
      })
      .state('app.chart', {
        url: '/chart',
        templateUrl: '/pages/chart/partials/chart.html',
      })
      // .state('app.table', {
      //   url: '/table',
      //   templateUrl: '/pages/table/partials/table.html',
      // })
      // .state('app.panel', {
      //   url: '/panel',
      //   templateUrl: '/pages/panel/partials/panel.html',
      // })

      ;

  });

