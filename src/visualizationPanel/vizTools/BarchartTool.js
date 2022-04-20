import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

export default function BarchartTool(props) {
  const { width, height } = props;
  console.log("Props in barchart tool", props);
  const svgRef = useRef(null);

  const svgWidth = width;
  const svgHeight = height;
  const margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  };

  const data = props.rankedWards;

  useEffect(() => {
    const svgEl = d3.select(svgRef.current);
    const h = svgHeight + 20;

    const x_scale = d3
      .scaleBand()
      .domain(
        data.map(function (d) {
          return d.name;
        })
      )
      .range([0, svgWidth - margin.right])
      .padding(0.2);

    const y_scale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Number(d.Average_pm25))])
      // .domain([0, 13000])
      .range([svgHeight, 20]);

    //ViewBOX
    svgEl.attr("viewBox", "-30 10" + " " + svgWidth + " " + h);

    if (svgHeight > 0) {
      /* X axis */
      svgEl
        .append("g")
        .call(d3.axisBottom(x_scale))
        .attr("transform", "translate(0," + svgHeight + ")") // -- for flipping top to bottom
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

      /* Y axis */
      svgEl.append("g").call(d3.axisLeft(y_scale));

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
        .attr("fill", "#9ad8f5");
    }
  });

  return <svg width={width} height={height} ref={svgRef}></svg>;
}
