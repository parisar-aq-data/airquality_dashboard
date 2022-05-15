import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

export default function InfocardTool(props) {
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
  const status =
    "Your " +
    (props.selectedMode === "WARD" ? "ward" : "monitor") +
    " ranks " +
    props.rank;

  useEffect(() => {
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();
    const h = svgHeight + 20;

    //ViewBOX
    svgEl.attr("viewBox", "-45 0" + " " + svgWidth + " " + h);

    if (svgHeight > 0) {
      svgEl
        .append("text")
        .text(status)
        .attr("x", svgHeight / 3)
        .attr("y", svgWidth / 5)
        .attr("fill", "#777")
        .attr("font-size", "32px");
    }
  });

  return (
    <div>
      <div className="vizTitle">{props.title}</div>
      <svg width={width} height={height} ref={svgRef}></svg>
    </div>
  );
}
