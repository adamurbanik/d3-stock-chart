class StockController {
  constructor(d3Service, $state, STATES) {
    Object.assign(this, { d3Service, $state, STATES });

    this.nasdaqItems = [
      'YHOO',
      'XAX',
      'VOLNDX',
      'NQGS',
      'RUI',
      'MID'
    ]

    this.defineDateDatePickers();

    this.initInput();

    this.selectedStocks = [];
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

  update() { 
    this.updateInput();
    this.d3Service.getStockData(this.prepareQuery());
    this.d3Service.setStock(`area${this.stockID}`);

    var self = this;
    setTimeout(function () {
      self.d3Service.prepareChart();
      self.d3Service.getChartData();
      self.d3Service.manageTable(['Close', 'Date', 'High', 'Low', 'Open', 'Symbol', 'Volume', 'Date'])
    }, 2000);

    this.selectedStocks.push({
      id: `area${this.stockID++}`,
      name: this.stock
    });
  }

  selectStock(stock) { console.log(stock)
    this.d3Service.setStock(stock.id);
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

  isCurrentChart() {
    return this.$state.includes(this.STATES.dailyChart);

  }


}

StockController.$inject = ['d3Service', '$state', 'STATES'];


angular
  .module('stockApp')
  .controller('stockController', StockController)



