class ChartController {
  constructor() {
    console.log(this);
  }
}

angular
  .module('stockApp')
  .controller('chartController', ChartController);