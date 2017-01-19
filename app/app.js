angular.module('stockApp', [
  'ui.router',
  'ui.bootstrap'
])
  .config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['**']);
    // $sceDelegateProvider.resourceUrlWhitelist([
    //   // Allow same origin resource loads.
    //   'self',
    //   // Allow loading from our assets domain.  Notice the difference between * and **.
    //   // 'http://srv*.assets.example.com/**'
    //   'http://d.yimg.com/autoc.finance.yahoo.com'
    // ]);
  });