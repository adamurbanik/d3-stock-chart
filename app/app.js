angular.module('stockApp', [
  'ui.router',
  'ui.bootstrap'
])
  .config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['**']);
  });