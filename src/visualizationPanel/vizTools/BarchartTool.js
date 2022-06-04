import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

export default function BarchartTool(props) {
  const { width, height } = props;
  const svgRef = useRef(null);

  const svgWidth = width;
  const svgHeight = height;
  const margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  };

  let data = props.rankedWards;
  let yAxisLabel = "Average PM 2.5";
  //SORTING BY RANK
  data = data.sort((a, b) => a.best - b.best);

  //REF: https://bl.ocks.org/guypursey/f47d8cd11a8ff24854305505dbbd8c07
  function wrap(text, width) {
    text.each(function () {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text
          .text(null)
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", dy + "em");
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", 0)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
        }
      }
    });
  }

  useEffect(() => {
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();
    const h = svgHeight + 20;

    // X Scale for data
    const x_scale = d3
      .scaleBand()
      .domain(
        data.map(function (d) {
          return d.name;
        })
      )
      .range([0, svgWidth - margin.right])
      .padding(0.2);

    // Y Scale for data
    const y_scale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Number(d.Average_pm25))])
      .range([svgHeight, 4 * margin.top]);

    // X Scale for LEGEND
    // We use two colors here for Highest and lowest pollution
    let legendInfo = [
      { label: "Lowest", color: "#9ad8f5" },
      { label: "Highest", color: "#FCC782" },
    ];
    let divisions = 4; // 1 more than the legend entries
    let size_per_division = svgWidth / divisions;
    const xLeg_Scale = d3
      .scaleLinear()
      .domain([0, Object.keys(legendInfo).length - 1])
      .range([size_per_division, width - size_per_division]);

    //ViewBOX
    svgEl.attr("viewBox", "-30 10" + " " + svgWidth + " " + h);

    let xAxis = d3.axisBottom(x_scale);

    if (svgHeight > 0) {
      let g_elem = svgEl.append("g");

      //** LEGEND INFO  */
      // g_elem
      //   .attr("transform", "translate(0," + svgHeight + ")")
      //   .selectAll("rect")
      //   .data(legendInfo)
      //   .join("rect")
      //   .attr("x", (d, i) => xLeg_Scale(i))
      //   .attr("y", 20 - svgHeight)
      //   .attr("width", 36)
      //   .attr("height", 18)

      //   // .attr("r", (d) => 10)
      //   .attr("fill", (d) => d.color);

      g_elem
        .attr("transform", "translate(0," + svgHeight + ")")
        .selectAll("text")
        .data(legendInfo)
        .join("text")
        .attr("x", (d, i) => xLeg_Scale(i))
        .attr("y", 2 * margin.top - svgHeight)
        .attr("dy", "0.5em")
        .text((d) => d.label)
        .attr("font-size", "18px")
        .attr("font-weight", "bold")
        .attr("fill", (d) => d.color);

      /* X axis */
      svgEl
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + svgHeight + ")") // -- for flipping top to bottom
        .call(xAxis)
        .selectAll(".tick text")
        .call(wrap, x_scale.bandwidth());

      /* Y axis */
      let yAxis = d3.axisLeft(y_scale);
      svgEl.append("g").call(yAxis);

      /* Y Axis label */
      svgEl
        .append("text")
        .attr("class", "y label")
        .attr("text-anchor", "start")
        .attr("x", -250) // TODO get rid of hard coded values
        .attr("y", -4 * margin.top)
        .attr("dy", ".75em")
        .attr("fill", "#7c7c7c")
        .attr("transform", "rotate(-90)")
        .text(yAxisLabel);

      /* BARS */
      svgEl
        .selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return x_scale(d.name);
        })
        .attr("y", function (d) {
          return y_scale(Number(d.Average_pm25));
        })
        .attr("width", x_scale.bandwidth())
        .attr("height", function (d) {
          return svgHeight - y_scale(Number(d.Average_pm25));
        })
        .attr("fill", function (d) {
          return d.best < 4 ? "#9ad8f5" : "#FCC782";
        });
    }
  });

  return (
    <div>
      <div className="vizTitle">{props.title}</div>
      <svg width={width} height={height} ref={svgRef}></svg>
    </div>
  );
}
