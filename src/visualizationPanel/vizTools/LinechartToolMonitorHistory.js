// import { render } from "@testing-library/react";
import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

export default function LinechartToolMonitorHistory(props) {
  const { width, height } = props;
  const svgRef = useRef(null);
  const targetValue = 40;

  const svgWidth = width;
  const svgHeight = height;
  const margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 100,
  };
  const monthOrder = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

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
  let yAxisLabel = "";
  let legendInfo = []; // will contain one object per legend entry

  

  const dataPrep = () => {
   const unsorted= props.pollutantHistory;
   data = unsorted.sort((a, b) =>{
    return Number(a.Month_number) - Number(b.Month_number)
   });
    console.log(data);
  };

  const renderMonitorView = (svgEl, xScale, yScale) => {
    const uniqueYears = [...new Set(d3.map(data, (d, i) => d.Year))];

    for (let yr = 0; yr < uniqueYears.length; yr++) {
      //filter all records belonging to a year
      let data_yr = data.filter((d) => d.Year === uniqueYears[yr]);

      //SORTING
      data_yr = data_yr.sort((a, b) => a.month_number - b.month_number);
      // if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
      // const D = d3.map(data, defined);

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
            // .defined((d) => D[d])
            .x((d) => xScale(d.Month) + xScale.bandwidth() / 2)
            .y((d) => yScale(Number(d.monthly_average_pm25)))
        );

      svgEl
        .append("g")
        .selectAll("circle")
        .data(data_yr)
        .enter()
        .append("circle")
        .attr("fill", (d) =>
          d.monthly_average_pm25 != "" ? colorPalette[yr] : "white"
        )
        .attr("stroke", colorPalette[yr])
        .attr("stroke-width", 1)
        .attr("r", 3)
        .attr("cx", (d) => xScale(d.Month) + xScale.bandwidth() / 2)
        .attr("cy", (d) => yScale(Number(d.monthly_average_pm25)));

      // Populate info for legend
      legendInfo.push({
        label: uniqueYears[yr].toString(),
        color: colorPalette[yr],
      });
    }
  };

  //CHART
  const renderLegend = (svgEl) => {
    // X Scale for LEGEND
    let divisions = legendInfo.length + 1; // 1 more than the legend entries
    let size_per_division = svgWidth / divisions;
    const xLeg_Scale = d3
      .scaleLinear()
      .domain([0, Object.keys(legendInfo).length - 1])
      .range([size_per_division, svgWidth - size_per_division]);

    //** LEGEND INFO  */
    svgEl
      .append("g")
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
  };

  useEffect(() => {
    dataPrep();
    yAxisLabel =
      props.selectedMode.type == "MPCB"
        ? "Monthly Average RSPM"
        : "Monthly Average PM 2.5 (μg/m³)";

    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();
    const h = svgHeight + 20;

    // const X = d3.map(data, (d, i) => d.Month);
    const X = props.panCityView
      ? d3.map(monthOrder, (d, i) => d)
      : d3.map(data, (d, i) => d.Month);

    // X scale
    const xScale = d3.scaleBand(new d3.InternSet(X), [
      0,
      svgWidth - margin.right,
    ]);

    // Y scale
    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => 0),
        Math.max(d3.max(data, (d) => Number(d.monthly_average_pm25)), targetValue),
      ])
      .range([svgHeight, 4 * margin.top]);

    //ViewBOX
    svgEl.attr("viewBox", "-30 -2" + " " + svgWidth + " " + h);

    if (svgHeight > 0) {
      /* X AXIS */
      svgEl
        .append("g")
        .attr("transform", "translate(0," + svgHeight + ")")
        .call(d3.axisBottom(xScale));
      /* Y AXIS */
      svgEl.append("g").call(d3.axisLeft(yScale));

      /* Y Axis label */
      svgEl
        .append("text")
        .attr("class", "y label")
        .attr("text-anchor", "start")
        .attr("x", -230) // TODO get rid of hard coded values
        .attr("y", -4 * margin.top)
        .attr("dy", ".75em")
        .attr("fill", "#7c7c7c")
        .attr("transform", "rotate(-90)")
        .text(yAxisLabel);

        svgEl
        .append("line")
        .attr("x1", 0)
        .attr("y1", yScale(targetValue))
        .attr("x2", svgWidth - margin.right)
        .attr("y2", yScale(targetValue))
        .attr("stroke", "red") // You can customize the line color
        .attr("stroke-width", 1);

        svgEl
        .append("text")
        .attr("class", "y label")
        .attr("text-anchor", "start")
        .attr("x", 10) // TODO get rid of hard coded values
        .attr("y", 150 )
        .attr("dy", ".75em")
        .attr("fill", "red")
        .attr("transform", "rotate(0)")
        .text("NAAQS allowable limit (annual)");


      renderMonitorView(svgEl, xScale, yScale);
      renderLegend(svgEl);
    }
  });

  return (
    <div>
      <div
        className={props.panCityView ? "vizTitleLineChartPancity" : "vizTitle"}
      >
        {props.title}
        {props.panCityView ? (
          <span className="titleNote">
            &emsp; &emsp;
            {
              "(*This chart is independent of the date range above. Hollow circles = missing data.)"
            }
          </span>
        ) : null}
      </div>

      <svg width={width} height={height} ref={svgRef}></svg>
    </div>
  );
}
