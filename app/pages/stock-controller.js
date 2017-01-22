class StockController {
  constructor(d3Service, $state, STATES, requestService, $sce, $q, $scope) {
    Object.assign(this, { d3Service, $state, STATES, requestService, $sce, $q, $scope });

    this.nasdaqItems = [
      'YHOO',
      'SRCE',
      'AAPL',
      'RUI',
      'YAO',
      'YORW',
      'ATEN'
    ]

    this.defineDateDatePickers();

    this.initInput();

    this.selectedStocks = [];

    this.$scope.$watch(
      () => this.startDate,
      () => this.updateCharts());

    this.$scope.$watch(
      () => this.endDate,
      () => this.updateCharts());

    this.stockData = [];
  }

  initInput() {
    this.startDate = new Date('2013', '08', '10');
    this.endDate = new Date('2014', '03', '10');
    this.stock = 'YHOO';
    this.stockID = 1;

    this.data = {
      stock: this.stock,
      startDate: this.startDate,
      endDate: this.endDate
    }

  }

  defineDateDatePickers() {
    this.dateOptions = {
      formatYear: 'yy',
      maxDate: new Date(2014, 3, 10),
      minDate: new Date(2013, 8, 10),
      startingDay: 1
    };


    this.inlineOptions = {
      customClass: this.getDayClass,
      minDate: new Date(),
      showWeeks: true
    };

    this.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    this.format = this.formats[0];
    this.altInputFormats = ['M!/d!/yyyy'];

    this.startDate = {
      opened: false
    };

    this.endDate = {
      opened: false
    }

    this.toggleMin();
  }

  setStock(stock) {
    this.stock = stock;
  }

  prepareQuery() {
    this.data.startDate = moment(this.data.startDate).format('YYYY-MM-DD');
    this.data.endDate = moment(this.data.endDate).format('YYYY-MM-DD');

    return `http://query.yahooapis.com/v1/public/yql` +
      `?q=select%20*%20from%20yahoo.finance.historicaldata%20` +
      `where%20symbol%20%3D%20%22`
      + `${this.data.stock} + %22%20and%20startDate%20%3D%20%22`
      + `${this.data.startDate} + %22%20and%20endDate%20%3D%20%22`
      + `${this.data.endDate} + %22&format=json&env=store%3A%2F%2F`
      + `datatables.org%2Falltableswithkeys`;
  }

  updateInput() {
    this.data = {
      stock: this.stock,
      startDate: this.startDate,
      endDate: this.endDate
    }
  }

  updateCharts() {
    if (!this.stockData) return;

    this.d3Service.updateCharts(this.stockData, this.startDate, this.endDate);
  }

  update() {
    this.updateInput();
    this.d3Service.setStock(`area${this.stockID}`);
    this.d3Service.getStockData(this.prepareQuery())
      .then((res) => {
        this.stockData.push(res);
        this.d3Service.getChartData();
        this.d3Service.manageTable(['Close', 'Date', 'High', 'Low', 'Open', 'Symbol', 'Volume', 'Date'])

        this.selectedStocks.push({
          id: `area${this.stockID++}`,
          name: this.stock
        });
        this.stock = null;
      });

    this.manageCompanyDetails();

  }

  buildQuery() {
    return `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fautoc.finance.yahoo.com%2Fautoc%3Fquery%3D${this.stock}%26region%3DEU%26lang%3Den-GB'&format=json`;
  }

  manageCompanyDetails() {
    var url = this.buildQuery();
    this.$sce.trustAsResourceUrl(url);

    let request = this.requestService.init(url);
    request.jsonp()
      .then((data) => {
        let results = JSON.parse(data.data.query.results.body);
        return this.$q.resolve(results);
      })
      .then((results) => this.companyNames = results.ResultSet.Result);

  }

  selectStock(stock) {
    this.d3Service.setStock(stock.id);
    this.stock = stock.name;
    this.manageCompanyDetails();
    this.d3Service.updateTable();
  }

  checkIfStockInUse(stock) { 
    return (this.selectedStocks.filter((item) => item.name === stock).length > 0);
  }

  checkIfStockSelected() {
    let invalid = false;
    if (!this.stock) invalid = true;
    if (this.selectedStocks.length >= 3) invalid = true;

    return invalid;
  }


  // date picker
  today() {
    this.dt = new Date();
  };

  clear() {
    this.dt = null;
  };


  toggleMin() {
    this.inlineOptions.minDate = this.inlineOptions.minDate ? null : new Date();
    this.dateOptions.minDate = this.inlineOptions.minDate;
  };

  startDateOpen() {
    this.startDate.opened = true;
  };

  endDateOpen() {
    this.endDate.opened = true;
  }

  getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

      for (var i = 0; i < this.events.length; i++) {
        var currentDay = new Date(this.events[i].date).setHours(0, 0, 0, 0);

        if (dayToCheck === currentDay) {
          return this.events[i].status;
        }
      }
    }

    return '';
  }

  isCurrentChart(state) {
    return this.$state.includes(state);

  }


}

StockController.$inject = ['d3Service', '$state', 'STATES', 'requestService', '$sce', '$q', '$scope'];


angular
  .module('stockApp')
  .controller('stockController', StockController)



