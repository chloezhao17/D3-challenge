// @TODO: YOUR CODE HERE!

// Intialize d3.tip
var tip = d3.tip().attr("class", "d3-tip");

// Create SVG container
var svgHeight = 400;
var svgWidth = 1000;

// Create margin
var margin = { top: 30, right: 30, bottom: 100, left: 100 };

// Chart area
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

// Create SVG canvas
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Create chartGroup to hold scatter plot
var chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
chartGroup.call(tip);

// set x to the bottom of the chart
var bottomAxis = chartGroup
  .append("g")
  .attr("transform", `translate(0, ${chartHeight})`);

// Add xaxis label
function xAxisGenerator(label, location) {
  group = chartGroup
    .append("text")
    .attr(
      "transform",
      `translate(${chartWidth / 2}, ${chartHeight + margin.top + location})`
    )
    .attr("text-anchor", "middle")
    .classed("axis-label", true)
    .text(label);
  return group;
}
var povertyAxis = xAxisGenerator("Poverty (%)", 20);
var ageAxis = xAxisGenerator("Age (Median)", 40);
var incomeAxis = xAxisGenerator("Household Income (Median)", 60);

// set y to the y axis
var leftAxis = chartGroup.append("g");

// Add yaxis label
function yAxisGenerator(label, location) {
  group = chartGroup
    .append("text")
    .attr("transform", `translate(${location}, ${chartHeight / 2}) rotate(-90)`)
    .attr("text-anchor", "middle")
    .classed("axis-label", true)
    .text(label);
  return group;
}
var healthcareAxis = yAxisGenerator("Lacks Healthcare (%)", -30);
var obeseAxis = yAxisGenerator("Obese (%)", -50);
var smokesAxis = yAxisGenerator("Smokes (%)", -70);

//Define circle and text variable
var circleGroup;
var text;

// Create function to graph with dynamic variables
function drawGraph(data, x = "poverty", y = "healthcare") {
  var color = "red"; //default
  switch (true) {
    case x == "poverty" && y == "healthcare":
      color = "red";
      break;
    case (x == "poverty" && y == "obesity") ||
      (x == "age" && y == "healthcare"):
      color = "purple";
      break;
    case (x == "poverty" && y == "smokes") ||
      (x == "income" && y == "healthcare"):
      color = "orange";
      break;
    case x == "age" && y == "obesity":
      color = "blue";
      break;
    case (x == "age" && y == "smokes") || (x == "income" && y == "obesity"):
      color = "green";
      break;
    case x == "income" && y == "smokes":
      color = "#ebcf00";
      break;
  }
  console.log(color);

  // scale x to chart width
  var xScale = d3
    .scaleLinear()
    .range([0, chartWidth])
    .domain(d3.extent(data, d => d[x]));

  // scale y to chart height
  var yScale = d3
    .scaleLinear()
    .range([chartHeight, 0])
    .domain(d3.extent(data, d => d[y]));

  // Create axes
  var yAxis = d3.axisLeft(yScale);
  var xAxis = d3.axisBottom(xScale);

  bottomAxis
    .transition()
    .duration(350)
    .call(xAxis);
  leftAxis
    .transition()
    .duration(350)
    .call(yAxis);

  circleGroup
    .transition()
    .duration(350)
    .attr("cx", d => xScale(d[x]))
    .attr("cy", d => yScale(d[y]))
    .attr("r", 10)
    .style("fill", color);

  text
    .transition()
    .duration(350)
    .attr("dx", d => xScale(d[x]))
    .attr("dy", d => yScale(d[y]) + 4)
    .style("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", "10px");

  povertyAxis
    .classed("active", x == "poverty")
    .attr("fill", d => {
      if (x == "poverty") {
        return "red";
      } else {
        return "black";
      }
    })
    .on("click", () => drawGraph(data, "poverty", y));
  ageAxis
    .classed("active", x == "age")
    .attr("fill", d => {
      if (x == "age") {
        return "blue";
      } else {
        return "black";
      }
    })
    .on("click", () => drawGraph(data, "age", y));
  incomeAxis
    .classed("active", x == "income")
    .attr("fill", d => {
      return x == "income" ? "#ebcf00" : "black";
    })
    .on("click", () => drawGraph(data, "income", y));
  //   if (color == "blue") {
  //     return color;
  //   } else {
  //     return "black";
  //   }
  // * SAME AS BELOW
  //   return color == "blue" ? color : "black";
  //           "?" - if; ":" - else
  healthcareAxis
    .classed("active", y == "healthcare")
    .attr("fill", d => {
      if (y == "healthcare") {
        return "red";
      } else {
        return "black";
      }
    })
    .on("click", () => drawGraph(data, x, "healthcare"));
  obeseAxis
    .classed("active", y == "obesity")
    .attr("fill", d => {
      if (y == "obesity") {
        return "blue";
      } else {
        return "black";
      }
    })
    .on("click", () => drawGraph(data, x, "obesity"));
  smokesAxis
    .classed("active", y == "smokes")
    .attr("fill", d => {
      if (y == "smokes") {
        return "#ebcf00";
      } else {
        return "black";
      }
    })
    .on("click", () => drawGraph(data, x, "smokes"));

  // Creat tooltip info box
  tip.html(
    d =>
      "<p style='font-weight:bold;font-size:15px'>" +
      d.state +
      "</p>" +
      "<p>" +
      x +
      ": " +
      d[x] +
      "</p><p>" +
      y +
      ": " +
      d[y] +
      "</p>"
  );
}

// pull in the data from `data.csv` by using the `d3.csv` function
d3.csv("./assets/data/data.csv").then(function(data) {
  console.log(data);

  data.forEach(function(d) {
    d.poverty = +d.poverty;
    d.healthcare = +d.healthcare;
    d.smokes = +d.smokes;
    d.obesity = +d.obesity;
    d.age = +d.age;
    d.income = +d.income;
  });

  // Create scatter plot
  circleGroup = chartGroup
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide);

  text = chartGroup
    .append("g")
    .classed("text-group", true)
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide)
    .text(d => d.abbr);
  drawGraph(data);
});
