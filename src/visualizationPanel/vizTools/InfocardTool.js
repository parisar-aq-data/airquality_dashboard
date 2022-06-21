import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

export default function InfocardTool(props) {
  const { width, height } = props;
  const svgRef = useRef(null);

  const svgWidth = width;
  const num_metrics = 4;
  const size_per_division = svgWidth / num_metrics;
  const svgHeight = height;
  const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  };

  // DATA to populate CHART
  //TODO find a better way to handle this issue
  let summaryData = [];
  if (props.wardOrMonitorSummary.length > 0) {
    let record = props.wardOrMonitorSummary[0];

    summaryData = [
      {
        index: 0,
        metric: record.num_missing_days,
        tag: "days of missing data",
      },
      {
        index: 1,
        metric:
          record.pollution_rank.toString() + "/" + record.num_units.toString(),
        tag: "highest pollution",
      },
      {
        index: 2,
        metric: record.count_exceeds_threshold,
        tag: "number of days exceeding threshold of 30 PM2.5",
      },
    ];
  }

  console.log("SUMMARY RECORD", summaryData);

  // const data = [
  //   { index: 0, metric: 15, tag: "days of missing data" },
  //   { index: 1, metric: 10, tag: "highest pollution" },
  //   {
  //     index: 2,
  //     metric: 22,
  //     tag: "number of days exceeding threshold of 20 aqi",
  //   },
  // ];

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
    const h = svgHeight + 100;

    //ViewBOX
    svgEl.attr("viewBox", "0 0" + " " + svgWidth + " " + h);

    const xScale = d3
      .scaleBand()
      .domain(
        summaryData.map(function (d) {
          return d.index;
        })
      )
      // .scaleLinear()
      // .domain([0, num_metrics - 1]) // the number of divisions i.e. 3 here is one less than the data range //**
      .range([size_per_division, width]);
    // .range([0, svgWidth]);

    if (svgHeight > 0) {
      //REf : http://bl.ocks.org/ChrisJamesC/4474971

      const x_scale = d3
        .scaleBand()
        .domain(
          summaryData.map(function (d) {
            return d.tag;
          })
        )
        .range([0, svgWidth])
        .padding(0.2);

      let xAxis = d3.axisBottom(x_scale);

      svgEl
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + svgHeight + ")") // -- for flipping top to bottom
        .call(xAxis)
        .selectAll(".tick text")
        .style("font-size", "18px")
        .call(wrap, x_scale.bandwidth());

      /* Y axis */
      // let yAxis = d3.axisLeft(y_scale);
      // svgEl.append("g").call(yAxis);

      // // let elem = svgEl.selectAll("g myCircleText").data(data);

      let g = svgEl.append("g");
      g.selectAll("circle")
        .data(summaryData) // **
        .join("circle")
        .attr("cx", (d) => x_scale(d.tag) + xScale.bandwidth() / 2)
        .attr("cy", height / 2)
        .attr("r", (d) => 90)
        .attr("fill", "#7df9ff");

      g.selectAll("text")
        .data(summaryData) // **
        .join("text")
        .attr("dx", (d) =>
          d.tag === "highest pollution"
            ? x_scale(d.tag) + x_scale.bandwidth() / 2 - 52
            : x_scale(d.tag) + x_scale.bandwidth() / 2 - 40
        )
        .attr("dy", height / 1.8)
        .text((d) => d.metric)
        .attr("fill", "#606161")
        .style("font-size", (d) =>
          d.tag === "highest pollution" ? "40px" : "50px"
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
