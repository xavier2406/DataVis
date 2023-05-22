function init() {
  var w = 800;
  var h = 600;
  var padding = 80;

  d3.csv("csv/ausDepartures.csv").then(function(data) {
    data.forEach(function(d) {
      d.Year = +d.Year;
      d.Value = +d.Value;
    });

    drawBarChart(data);
  });

  function drawBarChart(dataset) {
    var states = dataset.map(function(d) {
      return d.Category;
    });

    var years = dataset.map(function(d) {
      return d.Year;
    });

    var values = dataset.map(function(d) {
      return d.Value;
    });

    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    var xScale = d3.scaleBand()
      .domain(years)
      .range([padding, w - padding])
      .padding(0.1);

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(values)])
      .range([h - padding, padding]);

    var svg = d3.select(".barChart")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    var yAxis = d3.axisLeft()
      .ticks(10)
      .scale(yScale);

    var tooltip = d3.select(".barChart")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("padding", "10px")
      .style("font-size", "14px")
      .style("border-radius", "5px")
      .style("pointer-events", "none");

    svg.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .style("cursor", "pointer")
      .attr("x", function(d) {
        return xScale(d.Year);
      })
      .attr("y", function(d) {
        return yScale(d.Value);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) {
        return h - padding - yScale(d.Value);
      })
      .style("fill", function(d) {
        return colorScale(d.Category);
      })
      .on("mouseover", function(d) {
        d3.select(this)
          .style("stroke", "black")
          .style("stroke-width", "2px");
        tooltip.style("visibility", "visible")
          .html("Value: " + d.Value)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .style("stroke", "none");
        tooltip.style("visibility", "hidden");
      });
      
      

    // svg.selectAll("text")
    //   .data(dataset)
    //   .enter()
    //   .append("text")
    //   .text(function(d) {
    //     return d.Value;
    //   })
    //   .attr("x", function(d) {
    //     return xScale(d.Year) + xScale.bandwidth() / 2;
    //   })
    //   .attr("y", function(d) {
    //     return yScale(d.Value) - 5;
    //   })
    //   .attr("text-anchor", "middle")
    //   .attr("font-size", "12px")
    //   .attr("fill", "black");

    svg.append("g")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);

    svg.append("text")
      .attr("class", "axis-title")
      .attr("x", w / 2)
      .attr("y", h - padding + 40)
      .attr("text-anchor", "middle")
      .text("Year");

    svg.append("text")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-90)")
      .attr("x", -h / 2)
      .attr("y", padding - 50)
      .attr("text-anchor", "middle")
      .text("Amount of Departures");

    var legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(" + (w - padding - 120) + ",20)");

    var legendItem = legend.selectAll(".legend-item")
      .data(colorScale.domain())
      .enter().append("g")
      .attr("class", "legend-item")
      .attr("transform", function(d, i) {
        return "translate(0," + (i * 20) + ")";
      });

    legendItem.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", colorScale);

    legendItem.append("text")
      .attr("x", 15)
      .attr("y", 9)
      .text(function(d) {
        return d;
      })
      .attr("font-size", "12px");
  }

}

window.onload = init;
