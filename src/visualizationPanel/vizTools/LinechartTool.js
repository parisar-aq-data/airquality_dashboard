// import { render } from "@testing-library/react";
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

  let dates = null;
  let data = null;

  //PAn city view
  let iudx_data = null;
  let safar_data = null;
  let ward_data = null;
  //ward or monitor view
  let data_21 = null;
  let data_22 = null;

  let yAxisLabel = "Monthly Average PM 2.5 (μg/m³)";

  const dataPrep = () => {
    data = props.pollutantHistory;

    if (props.panCityView) {
      iudx_data = data.filter((d) => d.type === "iudx");
      safar_data = data.filter((d) => d.type === "safar");
      ward_data = data.filter((d) => d.type === "ward");
      dates = data.map((d) => new Date(d.Month_Year));
    } else {
      // for monitor specific view
      data_21 = data.filter((d) => d.Year === 2021);
      data_22 = data.filter((d) => d.Year === 2022);
      dates = data.map((d) => new Date(d.Month_Year));
    }
  };

  const renderPanCityView = (svgEl, x_scale, y_scale) => {
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
  };

  const renderMonitorView = (svgEl, x_scale, y_scale) => {
    //2021
    svgEl
      .append("path")
      .datum(data_21)
      .attr("fill", "none")
      .attr("stroke", "red")
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

    //2022
    svgEl
      .append("path")
      .datum(data_22)
      .attr("fill", "none")
      .attr("stroke", "green")
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
  };

  useEffect(() => {
    dataPrep();

    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();
    const h = svgHeight + 20;

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
      .range([svgHeight, 20]);

    //ViewBOX
    svgEl.attr("viewBox", "-30 10" + " " + svgWidth + " " + h);

    if (svgHeight > 0) {
      /* X AXIS */
      svgEl
        .append("g")
        .attr("transform", "translate(0," + svgHeight + ")") // -- for flipping top to bottom
        .call(d3.axisBottom(x_scale));

      /* Y AXIS */
      svgEl.append("g").call(d3.axisLeft(y_scale));

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

      if (props.panCityView) {
        renderPanCityView(svgEl, x_scale, y_scale);
      } else {
        renderMonitorView(svgEl, x_scale, y_scale);
      }
    }
  });

  return (
    <div>
      <div className="vizTitle">{props.title}</div>
      <svg width={width} height={height} ref={svgRef}></svg>
    </div>
  );
}
