class D3Service {
  constructor() {
    this.svg, this.svgChart, this.margin, this.marginStock, this.width, this.height, this.heightStock, this.parseDate,
      this.x, this.xStock, this.y, this.yStock, this.xAxis, this.yAxis, this.xAxisStock, this.brush, this.zoom, this.area,
      this.areaStock, this.focus, this.context, this.stockData

  }

  prepareStock() {
    this.svg = d3.select(".svg-stock");
    console.log(this.svg);
    this.marginStock = { top: 430, right: 20, bottom: 30, left: 40 };
    this.widthStock = +this.svg.attr("width") - this.marginStock.left - this.marginStock.right;
    this.heightStock = +this.svg.attr("height") - this.marginStock.top - this.marginStock.bottom;

    this.parseDate = d3.timeParse("%Y-%m-%d");

    this.xStock = d3.scaleTime().range([0, this.widthStock]);
    this.yStock = d3.scaleLinear().range([this.heightStock, 0]);

    this.xAxisStock = d3.axisBottom(this.xStock);

    this.brush = d3.brushX()
      .extent([[0, 0], [this.widthStock, this.heightStock]])
      .on("brush end", this.brushed);

    let self = this;

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
      // self.prepareChart();
      // self.getChartData(data);

    });
  }

  prepareChart() {
    this.svgChart = d3.select(".svg-chart");
    console.log('svgChart', this.svgChart);

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
      .on("zoom", this.zoomed);

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

    // this.svg.append("rect")
    //   .attr("class", "zoom")
    //   .attr("width", this.width)
    //   .attr("height", this.height)
    //   .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
    //   .call(this.zoom);
  }
  // brushed() {
  //   if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;
  //   if (!focus) return;
  //   var s = d3.event.selection || xStock.range();
  //   x.domain(s.map(xStock.invert, xStock));
  //   focus.select(".area").attr("d", area);
  //   focus.select(".axis--x").call(xAxis);
  //   svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
  //     .scale(width / (s[1] - s[0]))
  //     .translate(-s[0], 0));
  // }
  // zoomed() {
  //   if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return;
  //   var t = d3.event.transform;
  //   x.domain(t.rescaleX(xStock).domain());
  //   focus.select(".area").attr("d", area);
  //   focus.select(".axis--x").call(xAxis);
  //   context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
  // }
}

angular
  .module('stockApp')
  .service('d3Service', D3Service);


// function d3Service() {
//   var svg, svgChart, margin, marginStock, width, height, heightStock, parseDate,
//     x, xStock, y, yStock, xAxis, yAxis, xAxisStock, brush, zoom, area,
//     areaStock, focus, context, stockData, self;

//   return {
//     prepareStock() {
//       svg = d3.select(".svg-stock");
//       console.log(svg);
//         // margin = { top: 20, right: 20, bottom: 110, left: 40 },
//         marginStock = { top: 430, right: 20, bottom: 30, left: 40 },
//         // width = +svg.attr("width") - margin.left - margin.right,
//         // height = +svg.attr("height") - margin.top - margin.bottom,
//         widthStock = +svg.attr("width") - marginStock.left - marginStock.right,
//         heightStock = +svg.attr("height") - marginStock.top - marginStock.bottom;

//       parseDate = d3.timeParse("%Y-%m-%d");

//       // x = d3.scaleTime().range([0, width]);
//       // y = d3.scaleLinear().range([height, 0]);
//       xStock = d3.scaleTime().range([0, widthStock]);
//       yStock = d3.scaleLinear().range([heightStock, 0]);

//       // xAxis = d3.axisBottom(x);
//       // yAxis = d3.axisLeft(y);
//       xAxisStock = d3.axisBottom(xStock);

//       brush = d3.brushX()
//         .extent([[0, 0], [widthStock, heightStock]])
//         .on("brush end", this.brushed);

//       // zoom = d3.zoom()
//       //   .scaleExtent([1, Infinity])
//       //   .translateExtent([[0, 0], [width, height]])
//       //   .extent([[0, 0], [width, height]])
//       //   .on("zoom", this.zoomed);

//       // area = d3.area()
//       //   .curve(d3.curveMonotoneX)
//       //   .x(function (d) { return x(d.date); })
//       //   .y0(height)
//       //   .y1(function (d) { return y(d.high); });

//       areaStock = d3.area()
//         .curve(d3.curveMonotoneX)
//         .x(function (d) { return xStock(d.date); })
//         .y0(heightStock)
//         .y1(function (d) { return yStock(d.high); });

//       // svg.append("defs").append("clipPath")
//       //   .attr("id", "clip")
//       //   .append("rect")
//       //   .attr("width", width)
//       //   .attr("height", height);

//       // focus = svg.append("g")
//       //   .attr("class", "focus")
//       //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//       context = svg.append("g")
//         .attr("class", "context")
//         .attr("transform", "translate(" + marginStock.left + "," + marginStock.top + ")");

//     },
//     getStockData(url) {
//       self = this;
//       d3.json(url, function (error, data) {
//         if (error) throw error;

//         // self.data = data;

//         // stockData = data.query.results.quote;
//         data.query.results.quote.forEach(function (d) {
//           d.date = parseDate(d.Date);
//           d.high = +d.High;
//           d.low = +d.Low;
//         });

//         // x.domain(d3.extent(data.query.results.quote, function (d) { return d.date; }));
//         // y.domain([
//         //   d3.min(data.query.results.quote, function (d) { return d.low }),
//         //   d3.max(data.query.results.quote, function (d) { return d.high })
//         // ]);
//         xStock.domain(d3.extent(data.query.results.quote, function (d) { return d.date; }));
//         yStock.domain([
//           d3.min(data.query.results.quote, function (d) { return d.low }),
//           d3.max(data.query.results.quote, function (d) { return d.high })
//         ]);

//         // focus.append("path")
//         //   .datum(data.query.results.quote)
//         //   .attr("class", "area")
//         //   .attr("d", area);

//         // focus.append("g")
//         //   .attr("class", "axis axis--x")
//         //   .attr("transform", "translate(0," + height + ")")
//         //   .call(xAxis);

//         // focus.append("g")
//         //   .attr("class", "axis axis--y")
//         //   .call(yAxis);

//         context.append("path")
//           .datum(data.query.results.quote)
//           .attr("class", "area")
//           .attr("d", areaStock);

//         context.append("g")
//           .attr("class", "axis axis--x")
//           .attr("transform", "translate(0," + heightStock + ")")
//           .call(xAxisStock);

//         context.append("g")
//           .attr("class", "brush")
//           .call(brush)
//           .call(brush.move, xStock.range());

//         // svg.append("rect")
//         //   .attr("class", "zoom")
//         //   .attr("width", width)
//         //   .attr("height", height)
//         //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
//         //   .call(zoom);

//         self.prepareChart();
//         self.getChartData(data);

//       });
//     },
//     brushed() {
//       if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;
//       if (!focus) return;
//       var s = d3.event.selection || xStock.range();
//       x.domain(s.map(xStock.invert, xStock));
//       focus.select(".area").attr("d", area);
//       focus.select(".axis--x").call(xAxis);
//       svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
//         .scale(width / (s[1] - s[0]))
//         .translate(-s[0], 0));
//     },
//     zoomed() {
//       if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return;
//       var t = d3.event.transform;
//       x.domain(t.rescaleX(xStock).domain());
//       focus.select(".area").attr("d", area);
//       focus.select(".axis--x").call(xAxis);
//       context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
//     },
//     prepareChart() {
//       console.log('preparing chart')
//       svgChart = d3.select(".svg-chart");

//       margin = { top: 20, right: 20, bottom: 110, left: 40 };
//       width = +svg.attr("width") - margin.left - margin.right;
//       height = +svg.attr("height") - margin.top - margin.bottom;

//       x = d3.scaleTime().range([0, width]);
//       y = d3.scaleLinear().range([height, 0]);

//       xAxis = d3.axisBottom(x);
//       yAxis = d3.axisLeft(y);

//       zoom = d3.zoom()
//         .scaleExtent([1, Infinity])
//         .translateExtent([[0, 0], [width, height]])
//         .extent([[0, 0], [width, height]])
//         .on("zoom", this.zoomed);

//       area = d3.area()
//         .curve(d3.curveMonotoneX)
//         .x(function (d) { return x(d.date); })
//         .y0(height)
//         .y1(function (d) { return y(d.high); });

//       svgChart.append("defs").append("clipPath")
//         .attr("id", "clip")
//         .append("rect")
//         .attr("width", width)
//         .attr("height", height);

//       focus = svgChart.append("g")
//         .attr("class", "focus")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//       console.log(svgChart)
//     },
//     getChartData(data) {
//       console.log('getting chart data')
//       x.domain(d3.extent(data.query.results.quote, function (d) { return d.date; }));
//       y.domain([
//         d3.min(data.query.results.quote, function (d) { return d.low }),
//         d3.max(data.query.results.quote, function (d) { return d.high })
//       ]);

//       focus.append("path")
//         .datum(data.query.results.quote)
//         .attr("class", "area")
//         .attr("d", area);

//       focus.append("g")
//         .attr("class", "axis axis--x")
//         .attr("transform", "translate(0," + height + ")")
//         .call(xAxis);

//       focus.append("g")
//         .attr("class", "axis axis--y")
//         .call(yAxis);

//       svg.append("rect")
//         .attr("class", "zoom")
//         .attr("width", width)
//         .attr("height", height)
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
//         .call(zoom);
//     }

//   }

// }

// angular
//   .module('stockApp')
//   .factory('d3Service', d3Service);