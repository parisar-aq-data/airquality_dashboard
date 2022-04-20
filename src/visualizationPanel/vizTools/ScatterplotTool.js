import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function ScatterplotTool(props) {
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

  const data = [
    { Framework: "Vue", Stars: "180", Released: "2014" },
    { Framework: "React", Stars: "140", Released: "2013" },
    { Framework: "Angular", Stars: "20", Released: "2016" },
  ];

  useEffect(() => {
    const svgEl = d3.select(svgRef.current);
    const h = svgHeight + 20;

    const x_scale = d3
      .scaleLinear()
      .domain([2009, 2019])
      .range([0, svgWidth - margin.right]);
    const y_scale = d3.scaleLinear().domain([0, 200]).range([svgHeight, 20]);

    //ViewBOX
    svgEl.attr(
      "viewBox",
      "-" + margin.left + " " + margin.right + " " + svgWidth + " " + h
    );

    if (svgHeight > 0) {
      svgEl
        .append("g")
        .call(d3.axisBottom(x_scale).tickFormat(d3.format("d")))
        .attr("transform", "translate(0," + svgHeight + ")"); // -- for flipping top to bottom

      svgEl.append("g").call(d3.axisLeft(y_scale));

      const dots = svgEl.append("g");
      dots
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => x_scale(d.Released))
        // .attr("cx", 0) // test
        .attr("cy", (d) => y_scale(d.Stars))
        // .attr("cy", svgHeight) //test
        .attr("r", 10)
        .style("fill", "red");
    }
  }); //when data changes

  return (
    <div>
      <div className="vizTitle">{props.title}</div>
      <svg width={width} height={height} ref={svgRef}></svg>
    </div>
  );
}
