import React from "react";

import SVGContainer from "./SVGContainer.js";
import ScatterplotTool from "./vizTools/ScatterplotTool.js";
import ReactMapTool2 from "./vizTools/ReactMapTool2.js";
import BarchartToolHorizontal from "./vizTools/BarchartTool_Horizontal.js";
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
    const url = "http://localhost:5600/API/pollutantHistory";
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
    // this.getPollutantHistory();
  }

  render() {
    const ui = (
      <>
        <div className="textTool">
          {
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
          }
        </div>

        <SVGContainer>
          <BarchartToolHorizontal
            title={
              "Top 3 " +
              (this.props.selectedMode === "WARD" ? "wards" : "monitors") +
              " showing the lowest to highest levels of pm2.5"
            }
            rankedWards={this.props.rankedWards}
          ></BarchartToolHorizontal>
        </SVGContainer>

        <ReactMapTool2
          shapes={this.props.wardPolygons.shapes}
          monitors={this.props.wardPolygons.data}
          center={[18.502, 73.853]}
        ></ReactMapTool2>

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
                this.props.selectedMode +
                " " +
                this.props.selectedWardOrMonitor
              }
              pollutantHistory={this.props.wardOrMonitorHistory}
              panCityView={this.props.panCityView}
            ></LinechartToolMonitorHistory>
          </SVGContainer>
        )}
      </>
    );

    // const ui = (
    //   <>
    //     <ReactMapTool
    //       shapes={this.state.wardPolygons.shapes}
    //       monitors={this.state.wardPolygons.data}
    //     ></ReactMapTool>
    //     <div className="vizpanel1">
    //       <div className="textTool">
    //         {
    //           "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
    //         }
    //       </div>
    //     </div>

    //     <div className="vizpanel2">
    //       {this.state.loading ? (
    //         "Retrieving data . . ."
    //       ) : (
    //         <SVGContainer>
    //           <BarchartToolHorizontal
    //             title={
    //               "Top 3 Wards showing the lowest to highest levels of pm2.5 for " +
    //               today.toDateString().slice(4, 7) +
    //               " " +
    //               today.toDateString().slice(11)
    //             }
    //             rankedWards={this.state.rankedWards}
    //           ></BarchartToolHorizontal>
    //         </SVGContainer>
    //       )}
    //     </div>
    //   </>
    // );

    return <div className="vizpanel">{ui}</div>;
  }
}
