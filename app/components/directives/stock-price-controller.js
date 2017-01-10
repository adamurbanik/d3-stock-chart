class StockPriceController {
  constructor(d3Service) {
    Object.assign(this, { d3Service });
    this.d3Service.prepareD3();
    this.defineDateDatePickers();
    this.data = {
      stock: 'YHOO',
      startDate: new Date('2013', '08', '10'),
      endDate: new Date('2014', '03', '10')

    };
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
    this.data.stock = stock;
  }

  prepareQuery() {
    this.data.startDate = moment(this.data.startDate).format('YYYY-MM-DD');
    this.data.endDate = moment(this.data.endDate).format('YYYY-MM-DD');

    return "http://query.yahooapis.com/v1/public/yql" +
      "?q=select%20*%20from%20yahoo.finance.historicaldata%20" +
      "where%20symbol%20%3D%20%22"
      + this.data.stock + "%22%20and%20startDate%20%3D%20%22"
      + this.data.startDate + "%22%20and%20endDate%20%3D%20%22"
      + this.data.endDate + "%22&format=json&env=store%3A%2F%2F"
      + "datatables.org%2Falltableswithkeys";
  }

  update() {
    this.d3Service.getD3Data(this.prepareQuery(), this.data.stock);
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
}

StockPriceController.$inject = ['d3Service'];


angular
  .module('stockApp')
  .controller('stockPriceController', StockPriceController);



