angular.module('stockApp')
  .constant('STATES', {
    stockPrice: 'app.stockPrice',
    dailyChart: 'app.chart',
    tableData: 'app.table',
    panel: 'app.panel'
  });

// - A stock price graph over time
// - A chart showing daily high/low prices and volume traded for each stock by day
// - A table showing data for the selected stock.
// - A panel showing company details for the selected stock.