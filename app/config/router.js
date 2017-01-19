angular.module('stockApp')
  .config(function ($stateProvider, $urlRouterProvider) {

    const stockPath = 'pages/stock';


    $urlRouterProvider.otherwise('/app/stock-price');

    $stateProvider
      .state('app', {
        url: '/app',
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
      })
      .state('app.chart', {
        url: '/chart',
      })
      .state('app.table', {
        url: '/table',
      })
      .state('app.panel', {
        url: '/panel',
      })

      ;

  });

