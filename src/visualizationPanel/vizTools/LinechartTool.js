import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

export default function LinechartTool(props) {
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
  const data = props.pollutantHistory;
  const iudx_data = data.filter((d) => d.type === "iudx");
  const safar_data = data.filter((d) => d.type === "safar");
  const ward_data = data.filter((d) => d.type === "ward");
  const dates = data.map((d) => new Date(d.Month_Year));

  useEffect(() => {
    const svgEl = d3.select(svgRef.current);
    const h = svgHeight + 20;
    // const D = d3.map(data, defined);

    // X scale
    const x_scale = d3
      .scaleTime()
      .domain(d3.extent(dates))
      .nice()
      .range([0, svgWidth - margin.right]);

    // Y scale
    const y_scale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Number(d.monthly_average_pm25))])
      .range([svgHeight, 0]);

    //ViewBOX
    svgEl.attr("viewBox", "-10 0" + " " + svgWidth + " " + h);

    if (svgHeight > 0) {
      /* X AXIS */
      svgEl
        .append("g")
        .attr("transform", "translate(0," + svgHeight + ")") // -- for flipping top to bottom
        .call(d3.axisBottom(x_scale));

      /* Y AXIS */
      svgEl.append("g").call(d3.axisLeft(y_scale));

      // Add the line
      svgEl
        .append("line")
        .attr("fill", "none")
        .attr("stroke", "#D81B60")
        .attr("stroke-width", 2.5)
        .attr({
          x1: x_scale(d3.min(dates)),
          y1: y_scale(35), //start of the line
          x2: x_scale(d3.max(dates)),
          y2: y_scale(35), //end of the line
        });

      //IUDX
      svgEl
        .append("path")
        .datum(iudx_data)
        .attr("fill", "none")
        .attr("stroke", "#D81B60")
        .attr("stroke-width", 2.5)
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
              return x_scale(new Date(d.Month_Year));
            })
            .y(function (d) {
              return y_scale(Number(d.monthly_average_pm25));
            })
        );

      //SAFAR
      svgEl
        .append("path")
        .datum(safar_data)
        .attr("fill", "none")
        .attr("stroke", "#1E88E5")
        .attr("stroke-width", 2.5)
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
              return x_scale(new Date(d.Month_Year));
            })
            .y(function (d) {
              return y_scale(Number(d.monthly_average_pm25));
            })
        );

      svgEl
        .append("path")
        .datum(ward_data)
        .attr("fill", "none")
        .attr("stroke", "#004D40")
        .attr("stroke-width", 2.5)
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
              return x_scale(new Date(d.Month_Year));
            })
            .y(function (d) {
              return y_scale(Number(d.monthly_average_pm25));
            })
        );
    }
  });

  return (
    <div>
      <div className="vizTitle">{props.title}</div>
      <svg width={width} height={height} ref={svgRef}></svg>
    </div>
  );
}
