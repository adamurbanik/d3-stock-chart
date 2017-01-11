function d3Service() {
  var margin, width, height, parseDate, x, y, xAxis, yAxis, valueline, svg, labelPositionX;

  return {
    prepareD3() {
      margin = { top: 30, right: 40, bottom: 30, left: 50 },
        width = 600 - margin.left - margin.right,
        height = 270 - margin.top - margin.bottom,
        xDistance = 3, yDistance = 0.7;

      // Parse the date / time
      parseDate = d3.time.format("%Y-%m-%d").parse;

      // Set the ranges
      x = d3.time.scale().range([0, width]);
      y = d3.scale.linear().range([height, 0]);

      xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5);

      yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(5);

      valueline = d3.svg.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.high); });

      svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate("
        + margin.left
        + "," + margin.top + ")");

      svg.append("g")            // Add the X Axis
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      svg.append("g")            // Add the Y Axis
        .attr("class", "y axis")
        .call(yAxis);
    },

    getD3Data(url, stock) {
      console.log(url)
      // var self = this;
      d3.json(url, function (error, data) {
        if (error) {
          console.error(error);
          return;
        }
        console.log(data.query);


        data.query.results.quote.forEach(function (d) {
          d.date = parseDate(d.Date);
          d.high = +d.High;
          d.low = +d.Low;
        });

        // Scale the range of the data
        x.domain(d3.extent(data.query.results.quote, function (d) {
          return d.date;
        }));
        y.domain([
          d3.min(data.query.results.quote, function (d) { return d.low; }),
          d3.max(data.query.results.quote, function (d) { return d.high; })
        ]);

        svg.append("path")        // Add the valueline path.
          .attr("class", "line")
          .attr("d", valueline(data.query.results.quote));



        svg.append("text")          // Add the label
          .attr("class", "label")
          .attr("transform", "translate(" + (width + 3) + ","
          + y(data.query.results.quote[0].high) + ")")
          .attr("dy", ".35em")
          .attr("text-anchor", "start")
          .style("fill", "steelblue")
          .text("high");

        svg.append("text")          // Add the title shadow
          .attr("transform", "translate(" + (width + xDistance) + ","
          + y(data.query.results.quote[0].high + yDistance) + ")")
          .attr("text-anchor", "middle")
          .attr("class", "shadow")
          .style("font-size", "16px")
          .text(stock);

        svg.append("text")          // Add the title
          .attr("class", "stock")
          .attr("transform", "translate(" + (width + xDistance) + ","
          + y(data.query.results.quote[0].high + yDistance) + ")")
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .text(stock);

      });
    }

  }

}

angular
  .module('stockApp')
  .factory('d3Service', d3Service);