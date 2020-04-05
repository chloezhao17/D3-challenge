// @TODO: YOUR CODE HERE!
// Project: create a scatter plot between two of the data variables `Healthcare vs. Poverty`

// Create SVG container
var svgHeight = 400;
var svgWidth = 1000;

// Create margin
var margin = { top: 30, right: 30, bottom: 50, left: 50 };

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

// pull in the data from `data.csv` by using the `d3.csv` function
d3.csv("./assets/data/data.csv")
  .then(function(data) {
    console.log(data);

    var abbr = data.map(d => d.abbr);

    data.forEach(function(d) {
      d.poverty = parseFloat(d.poverty);
      d.healthcare = parseFloat(d.healthcare);
    });

    // scale x to chart height
    var xScale = d3
      .scaleLinear()
      .range([0, chartWidth])
      .domain(d3.extent(data, d => d.poverty));

    // scale y to chart height
    var yScale = d3
      .scaleLinear()
      .range([chartHeight, 0])
      .domain(d3.extent(data, d => d.healthcare));

    // Create axes
    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    // set x to the bottom of the chart
    chartGroup
      .append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis);

    chartGroup
      .append("text")
      .attr(
        "transform",
        `translate(${chartWidth / 2}, ${chartHeight + margin.top + 10})`
      )
      .attr("text-anchor", "middle")
      .text("Poverty (%)");

    // set y to the y axis
    chartGroup.append("g").call(yAxis);
    chartGroup
      .append("text")
      .attr("transform", `translate(-30, ${chartHeight / 2}) rotate(-90)`)
      .attr("text-anchor", "middle")
      .text("Lacks Healthcare (%)");

    // Create scatter plot
    chartGroup
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.poverty))
      .attr("cy", d => yScale(d.healthcare))
      .attr("r", 10)
      .style("fill", "purple");

    // Include state abbreviations in the circles.
    var text = chartGroup.append("g").classed("text-group", true);
    text
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text(d => d.abbr)
      .attr("dx", d => xScale(d.poverty))
      .attr("dy", d => yScale(d.healthcare) + 4)
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "10px");

    console.log(text);
  })
  .catch(error => console.log(error));
