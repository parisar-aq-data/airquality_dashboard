import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

export default function BarchartToolHorizontal(props) {
  const { width, height } = props;
  const svgRef = useRef(null);

  const svgWidth = width;
  const svgHeight = height;
  const margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 100,
  };

  // DATA to populate CHART
  let data = props.rankedWards;
  //SORTING BY RANK
  data = data.sort((a, b) => b.best - a.best);

  useEffect(() => {
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();
    const h = svgHeight + 20;

    // Y
    const y_scale = d3
      .scaleBand()
      .domain(
        data.map(function (d) {
          return d.name;
        })
      )
      .range([svgHeight, 0])
      .padding(0.2);

    // X
    const x_scale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Number(d.Average_pm25))])
      .nice()
      .range([0, svgWidth - margin.right]);

    //ViewBOX
    svgEl.attr("viewBox", "-45 0" + " " + svgWidth + " " + h);

    if (svgHeight > 0) {
      /* X axis */
      svgEl
        .append("g")
        .call(d3.axisBottom(x_scale))
        .attr("transform", "translate(0," + svgHeight + ")"); // -- for flipping top to bottom

      /* Y axis */
      svgEl.append("g").call(d3.axisLeft(y_scale));

      svgEl
        .selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("height", function (d) {
          return y_scale.bandwidth();
        })
        .attr("y", function (d) {
          return y_scale(d.name);
        })
        .attr("width", function (d) {
          return x_scale(Number(d.Average_pm25));
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
