// import { render } from "@testing-library/react";
import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

export default function LinechartToolMonitorHistory(props) {
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

  // https://personal.sron.nl/~pault/
  // Safe for color blindness as well
  const colorPalette = [
    "#4477AA",
    "#EE6677",
    "#228833",
    "#CCBB44",
    "#66CCEE",
    "#AA3377",
    "#BBBBBB",
  ];

  let data = null;

  const dataPrep = () => {
    data = props.pollutantHistory;
    // console.log("data in linechart 2", data);
  };

  const renderMonitorView = (svgEl, xScale, yScale) => {
    const uniqueYears = [...new Set(d3.map(data, (d, i) => d.Year))];
    for (let yr = 0; yr < uniqueYears.length; yr++) {
      let data_yr = data.filter((d) => d.Year === uniqueYears[yr]);

      //SORTING
      data_yr = data_yr.sort((a, b) => a.month_number - b.month_number);
      // console.log("Sorted data", data_yr);

      svgEl
        .append("path")
        .datum(data_yr)
        .attr("fill", "none")
        .attr("stroke", colorPalette[yr])
        .attr("stroke-width", 1)
        .attr(
          "d",
          d3
            .line()
            .x((d) => xScale(d.Month) + xScale.bandwidth() / 2)
            .y((d) => yScale(Number(d.monthly_average_pm25)))
        );

      svgEl
        .append("g")
        .selectAll("circle")
        .data(data_yr)
        .enter()
        .append("circle")
        .attr("fill", colorPalette[yr])
        .attr("stroke", colorPalette[yr])
        .attr("stroke-width", 1)
        .attr("r", 3)
        .attr("cx", (d) => xScale(d.Month) + xScale.bandwidth() / 2)
        .attr("cy", (d) => yScale(Number(d.monthly_average_pm25)));
    }
  };

  useEffect(() => {
    dataPrep();

    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();
    const h = svgHeight + 20;

    const X = d3.map(data, (d, i) => d.Month);

    // X scale
    const xScale = d3.scaleBand(new d3.InternSet(X), [
      0,
      svgWidth - margin.right,
    ]);

    // Y scale
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Number(d.monthly_average_pm25))])
      .range([svgHeight, 0]);

    //ViewBOX
    svgEl.attr("viewBox", "-10 -2" + " " + svgWidth + " " + h);

    if (svgHeight > 0) {
      /* X AXIS */
      svgEl
        .append("g")
        .attr("transform", "translate(0," + svgHeight + ")")
        .call(d3.axisBottom(xScale));
      /* Y AXIS */
      svgEl.append("g").call(d3.axisLeft(yScale));

      renderMonitorView(svgEl, xScale, yScale);
    }
  });

  return (
    <div>
      <div className="vizTitle">{props.title}</div>
      <svg width={width} height={height} ref={svgRef}></svg>
    </div>
  );
}
