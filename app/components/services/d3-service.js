class D3Service {
  constructor() {
    this.svg, this.svgChart, this.margin, this.marginStock, this.width, this.height, this.heightStock, this.parseDate,
      this.x, this.xStock, this.y, this.yStock, this.xAxis, this.yAxis, this.xAxisStock, this.brush, this.zoom, this.area,
      this.areaStock, this.focus, this.context, this.stockData, this.table, this.thead, this.tbody, this.rows, this.cells;

  }

  prepareStock() {
    let self = this;
    this.svg = d3.select(".svg-stock");
    this.marginStock = { top: 60, right: 20, bottom: 100, left: 40 };
    this.widthStock = +this.svg.attr("width") - this.marginStock.left - this.marginStock.right;
    this.heightStock = +this.svg.attr("height") - this.marginStock.top - this.marginStock.bottom;

    this.parseDate = d3.timeParse("%Y-%m-%d");

    this.xStock = d3.scaleTime().range([0, this.widthStock]);
    this.yStock = d3.scaleLinear().range([this.heightStock, 0]);

    this.xAxisStock = d3.axisBottom(this.xStock);

    this.brush = d3.brushX()
      .extent([[0, 0], [this.widthStock, this.heightStock]])
      .on("brush end", this.brushed.bind(this));


    this.areaStock = d3.area()
      .curve(d3.curveMonotoneX)
      .x(function (d) { return self.xStock(d.date); })
      .y0(this.heightStock)
      .y1(function (d) { return self.yStock(d.high); });

    this.context = this.svg.append("g")
      .attr("class", "context")
      .attr("transform", "translate(" + this.marginStock.left + "," + this.marginStock.top + ")");
  }

  getStockData(url) {
    self = this;
    d3.json(url, function (error, data) {
      if (error) throw error;

      data.query.results.quote.forEach(function (d) {
        d.date = self.parseDate(d.Date);
        d.high = +d.High;
        d.low = +d.Low;
      });

      self.xStock.domain(d3.extent(data.query.results.quote, function (d) { return d.date; }));
      self.yStock.domain([
        d3.min(data.query.results.quote, function (d) { return d.low }),
        d3.max(data.query.results.quote, function (d) { return d.high })
      ]);

      self.context.append("path")
        .datum(data.query.results.quote)
        .attr("class", "area")
        .attr("d", self.areaStock);

      self.context.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + self.heightStock + ")")
        .call(self.xAxisStock);

      self.context.append("g")
        .attr("class", "brush")
        .call(self.brush)
        .call(self.brush.move, self.xStock.range());

      self.stockData = data;

    });
  }

  prepareChart() {
    this.svgChart = d3.select(".svg-chart");

    this.margin = { top: 20, right: 20, bottom: 110, left: 40 };
    this.width = +this.svgChart.attr("width") - this.margin.left - this.margin.right;
    this.height = +this.svgChart.attr("height") - this.margin.top - this.margin.bottom;

    this.x = d3.scaleTime().range([0, this.width]);
    this.y = d3.scaleLinear().range([this.height, 0]);

    this.xAxis = d3.axisBottom(this.x);
    this.yAxis = d3.axisLeft(this.y);

    this.zoom = d3.zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [this.width, this.height]])
      .extent([[0, 0], [this.width, this.height]])
      .on("zoom", this.zoomed.bind(this));

    var self = this;
    this.area = d3.area()
      .curve(d3.curveMonotoneX)
      .x(function (d) { return self.x(d.date); })
      .y0(this.height)
      .y1(function (d) { return self.y(d.high); });

    this.svgChart.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", this.width)
      .attr("height", this.height);

    this.focus = this.svgChart.append("g")
      .attr("class", "focus")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  }
  getChartData(data) {
    this.x.domain(d3.extent(data.query.results.quote, function (d) { return d.date; }));
    this.y.domain([
      d3.min(data.query.results.quote, function (d) { return d.low }),
      d3.max(data.query.results.quote, function (d) { return d.high })
    ]);

    this.focus.append("path")
      .datum(data.query.results.quote)
      .attr("class", "area")
      .attr("d", this.area);

    this.focus.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.height + ")")
      .call(this.xAxis);

    this.focus.append("g")
      .attr("class", "axis axis--y")
      .call(this.yAxis);

    this.svgChart.append("rect")
      .attr("class", "zoom")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
      .call(this.zoom);

  }
  brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;
    if (!this.focus) return;
    var s = d3.event.selection || this.xStock.range();
    this.x.domain(s.map(this.xStock.invert, this.xStock));
    this.focus.select(".area").attr("d", this.area);
    this.focus.select(".axis--x").call(this.xAxis);
    this.svgChart.select(".zoom").call(this.zoom.transform, d3.zoomIdentity
      .scale(this.width / (s[1] - s[0]))
      .translate(-s[0], 0));

    
    // var xDomain = this.x.domain();
    // var dataBrushed = this.stockData.query.results.quote.filter(function (d) { 
    //   return xDomain[0] <= d.date && xDomain[1] >= d.date;
    // });

    this.updateTable();
  }
  zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return;
    var t = d3.event.transform;
    this.x.domain(t.rescaleX(this.xStock).domain());
    this.focus.select(".area").attr("d", this.area);
    this.focus.select(".axis--x").call(this.xAxis);
    this.context.select(".brush").call(this.brush.move, this.x.range().map(t.invertX, t));
  }
  updateTable() {
    var columns = ['Close', 'Date', 'High', 'Low', 'Open', 'Symbol', 'Volume', 'Date'];
    var xDomain = this.x.domain();
    var data = this.stockData.query.results.quote.filter(function (d) { 
      return xDomain[0] <= d.date && xDomain[1] >= d.date;
    });

    this.thead.remove();
    this.tbody.remove();
    this.thead = this.table.append("thead");
    this.tbody = this.table.append("tbody");

    // append the header row
    this.thead.append("tr")
      .selectAll("th")
      .data(columns)
      .enter()
      .append("th")
      .text(function (column) { return column; });

    // create a row for each object in the data
    this.rows = this.tbody.selectAll("tr")
      .data(data)
      .enter()
      .append("tr");

    // create a cell in each row for each column
    this.cells = this.rows.selectAll("td")
      .data(function (row) {
        return columns.map(function (column) {
          return { column: column, value: row[column] };
        });
      })
      .enter()
      .append("td")
      .attr("class", "data") // sets the font style
      .html(function (d) { return d.value; });

  }
  tabulate(data, columns) {
    this.table = d3.select(".stock-table")
    this.thead = this.table.append("thead");
    this.tbody = this.table.append("tbody");

    // append the header row
    this.thead.append("tr")
      .selectAll("th")
      .data(columns)
      .enter()
      .append("th")
      .text(function (column) { return column; });

    // create a row for each object in the data
    this.rows = this.tbody.selectAll("tr")
      .data(data)
      .enter()
      .append("tr");

    // create a cell in each row for each column
    this.cells = this.rows.selectAll("td")
      .data(function (row) {
        return columns.map(function (column) {
          return { column: column, value: row[column] };
        });
      })
      .enter()
      .append("td")
      .attr("class", "data") // sets the font style
      .html(function (d) { return d.value; });

  }
  manageTable(data) {
    this.tabulate(data.query.results.quote, ['Close', 'Date', 'High', 'Low', 'Open', 'Symbol', 'Volume', 'Date'])

  }

}

angular
  .module('stockApp')
  .service('d3Service', D3Service);

