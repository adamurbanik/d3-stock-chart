class SidenavController {
  constructor($state) {
    Object.assign(this, { $state });

    this.links = [
      {
        name: 'Stock Price',
        state: 'app.stockPrice',
        stateOptions: { inherit: true, reload: true }
      },
      {
        name: 'Chart',
        state: 'app.chart',
        stateOptions: { inherit: true, reload: true }
      },
      {
        name: 'Table',
        state: 'app.table',
        stateOptions: { inherit: true, reload: true }
      },
      {
        name: 'Panel',
        state: 'app.panel',
        stateOptions: { inherit: true, reload: true }
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



