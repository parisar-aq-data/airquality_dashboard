import React from "react";
import * as paths from "./../paths";

import SVGContainer from "./SVGContainer.js";
import ScatterplotTool from "./vizTools/ScatterplotTool.js";
import ReactMapTool from "./vizTools/ReactMapTool.js";
import InfocardTool from "./vizTools/InfocardTool.js";
import BarchartTool from "./vizTools/BarchartTool.js";
import LinechartTool from "./vizTools/LinechartTool.js";
import LinechartToolMonitorHistory from "./vizTools/LinechartToolMonitorHistory.js";

export default class VizPanel extends React.Component {
  // const [showSVG, setShowSVG] = useState(false); // look up destructuring
  // function clickHandler() {
  //     setShowSVG(true);
  // }

  constructor(props) {
    super(props);

    this.state = {
      pollutantHistory: [],
    };
  }

  async getPollutantHistory() {
    // retrieving data
    const url = paths.POLLUTANTHISTORY;
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: null,
    };
    const response = await fetch(url, requestOptions);

    //processing retrieved data
    const poll_history = await response.json();
    console.log(" * * * * POLLUTANT HISTORY * * * * ", poll_history);

    this.setState({
      pollutantHistory: poll_history.data,
      loading: false,
    });
  }

  componentDidMount() {
    this.getPollutantHistory();
  }

  render() {
    let units = [];
    let type = "WARD";

    if (this.props.wardPolygons.data !== undefined) {
      units = this.props.wardPolygons.data.filter(
        (unit) =>
          unit.type.toUpperCase() === this.props.selectedMode.type.toUpperCase()
      );
      type = this.props.selectedMode.type === "WARD" ? "ward" : "monitor";
    }

    const ui = (
      <>
        <div className="text_n_map">
          <div className="textTool display-linebreak">
            {"This dashboard reports PM 2.5 from various data sources available in Pune. " +
              "The " +
              this.props.selectedMode.name +
              " data is collected by " +
              units.length +
              " " +
              type +
              "s all across Pune.\n"}
            <span style={{ fontStyle: "italic" }}>
              {" To know more, select your " +
                type +
                " from the dropdown above.\n"}
            </span>
            <br />
            {
              "PM 2.5 (particulate matter), an air pollutant, is very harmful to our health. It not only enters our lungs, but can also enter our bloodstream and affect many of our vital organs like the heart, brain and kidneys."
            }
          </div>
          <div className="mapBaap">
            <ReactMapTool
              panCityView={this.props.panCityView}
              shapes={this.props.wardPolygons.shapes}
              monitors={this.props.wardPolygons.data}
              selectedMode={this.props.selectedMode}
              selectedWardOrMonitor={this.props.selectedWardOrMonitor}
            ></ReactMapTool>
          </div>
        </div>
        <div className="bar_n_line">
          {this.props.panCityView ? (
            <SVGContainer>
              <BarchartTool
                title={
                  "Top 3 " +
                  (this.props.selectedMode.type === "WARD"
                    ? "wards"
                    : "monitors") +
                  " showing the lowest to highest levels of pm2.5"
                }
                rankedWards={this.props.rankedWards}
              ></BarchartTool>
            </SVGContainer>
          ) : (
            <SVGContainer>
              <InfocardTool
                title={this.props.selectedWardOrMonitor}
                selectedMode={this.props.selectedMode}
                selectedWardOrMonitor={this.props.selectedWardOrMonitor}
                wardOrMonitorSummary={this.props.wardOrMonitorSummary}
              />
            </SVGContainer>
          )}

          {this.props.panCityView ? (
            <SVGContainer>
              <LinechartTool
                title={"PM2.5 for PAN CITY VIEW"}
                pollutantHistory={this.state.pollutantHistory}
                panCityView={this.props.panCityView}
              ></LinechartTool>
            </SVGContainer>
          ) : (
            <SVGContainer>
              <LinechartToolMonitorHistory
                title={
                  "PM2.5 history for " +
                  this.props.selectedMode.type +
                  " " +
                  this.props.selectedWardOrMonitor
                }
                pollutantHistory={this.props.wardOrMonitorHistory}
                panCityView={this.props.panCityView}
              ></LinechartToolMonitorHistory>
            </SVGContainer>
          )}
        </div>
      </>
    );

    return <div className="vizpanel">{ui}</div>;
  }
}
