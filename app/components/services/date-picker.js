function datePicker() {
  return {
    today() {
      this.dt = new Date();
    },

    clear() {
      this.dt = null;
    },

    toggleMin() {
      this.inlineOptions.minDate = this.inlineOptions.minDate ? null : new Date();
      this.dateOptions.minDate = this.inlineOptions.minDate;
    },

    startDateOpen() {
      this.startDate.opened = true;
    },

    endDateOpen() {
      this.endDate.opened = true;
    },

    setDate(year, month, day) {
      this.dt = new Date(year, month, day);
    },

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
}

angular
  .module('stockApp')
  .factory('datePicker', datePicker);