import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

export default function InfocardTool(props) {
  const { width, height,startDate,endDate } = props;
  const svgRef = useRef(null);
  const daysCount=getDaysBetweenDates(startDate,endDate);
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
        metric: daysCount,
        tag: "Total No.of days",

      },
      {
        index: 1,
        metric: record.num_missing_days,
        tag: "days of missing data",
        percentage:Math.round((record.num_missing_days/daysCount)*100)
      },
      {
        index: 2,
        metric:
        record.pollution_rank.toString() + "/" + record.num_units.toString(),
        tag: "Pollution Rank",
      },
      {
        index: 3,
        metric: record.count_exceeds_threshold,
        tag: "No.of days exceeding daily allowable NAAQS limit (60 ug/m3)",
        percentage:Math.round((record.count_exceeds_threshold/daysCount)*100)
      },
    ];
  }

  // console.log("SUMMARY RECORD", summaryData);

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

  function getDaysBetweenDates(startDate, endDate) {
    return Math.round((new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24));
  }
  


  useEffect(() => {


    console.log(props);
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
      
      <h4 className="text-center">{props.title}</h4>
      <div className="d-flex justify-content-center gap-2 align-items-start mt-5">
      {summaryData.map((summary,index)=>{
       return(
        <div>
          <div className="bg-primary d-flex flex-column justify-content-center align-items-center"
               style={{height:"120px",width:"120px",borderRadius:"50%"}}>
              <h3 className="text-white font-weight-bold">{summary.metric}</h3>
              {console.log(summary.percentage)}
              {summary.percentage?(<h3 style={{height:"50px",width:"50px",fontSize:"20px"}} className="d-flex justify-content-center align-items-center text-white bg-info p-2 rounded-circle ">{summary.percentage}%</h3>):""}
          </div>
          <h6 className="text-center mt-2" style={{width:"130px",fontSize:"12px"}}>{summary.tag}</h6>  
        </div>
       ); 
      })}
        </div>
      
      {/* <svg width={width} height={height} ref={svgRef}></svg> */}
    </div>
  );
}
