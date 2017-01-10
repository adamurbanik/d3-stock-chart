class StockController {
  constructor() {
    console.log(StockController);

    this.nasdaqItems = [
      'YHOO',
      'XAX',
      'VOLNDX',
      'NQGS',
      'RUI',
      'MID'
    ]
  }
}

angular
  .module('stockApp')
  .controller('stockController', StockController)



