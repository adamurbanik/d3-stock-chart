class SidenavController {
  constructor($state) {
    Object.assign(this, { $state });

    this.links = [
      {
        name: 'Stock Price',
        state: 'app.stockPrice',
        stateOptions: { inherit: false, reload: true }
      },
      {
        name: 'Chart',
        state: 'app.chart',
        stateOptions: { inherit: false, reload: true }
      },
      {
        name: 'Table',
        state: 'app.table',
        stateOptions: { inherit: false, reload: true }
      },
      {
        name: 'Panel',
        state: 'app.panel',
        stateOptions: { inherit: false, reload: true }
      }
    ]

  }


  getCurrentState(state) {
    return this.$state.includes(state);
  }


}

SidenavController.$inject = [
  '$state'
]

angular
  .module('stockApp')
  .controller('sidenavController', SidenavController);



