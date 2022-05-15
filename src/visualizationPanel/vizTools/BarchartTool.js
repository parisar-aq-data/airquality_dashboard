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
  //SORTING BY RANK
  data = data.sort((a, b) => a.best - b.best);

  //REF: https://bl.ocks.org/guypursey/f47d8cd11a8ff24854305505dbbd8c07
  function wrap(text, width) {
    console.log("calling wrap");
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

    let xAxis = d3.axisBottom(x_scale);

    if (svgHeight > 0) {
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
