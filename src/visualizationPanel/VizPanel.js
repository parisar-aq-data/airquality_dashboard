import React from "react";

import SVGContainer from "./SVGContainer.js";
import ScatterplotTool from "./vizTools/ScatterplotTool.js";
import ReactMapTool from "./vizTools/ReactMapTool.js";
import BarchartToolHorizontal from "./vizTools/BarchartTool_Horizontal.js";
import LinechartTool from "./vizTools/LinechartTool.js";

export default class VizPanel extends React.Component {
  // const [showSVG, setShowSVG] = useState(false); // look up destructuring
  // function clickHandler() {
  //     setShowSVG(true);
  // }

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      wardPolygons: [],
      pollutantHistory: [
        // {
        //   Month_Year: "2021-03-01",
        //   type: "iudx",
        //   monthly_average_pm25: "10.32",
        // },
        // {
        //   Month_Year: "2021-04-01",
        //   type: "iudx",
        //   monthly_average_pm25: "4.93",
        // },
        // {
        //   Month_Year: "2021-05-01",
        //   type: "iudx",
        //   monthly_average_pm25: "8.49",
        // },
        // {
        //   Month_Year: "2021-06-01",
        //   type: "iudx",
        //   monthly_average_pm25: "9.94",
        // },
        // {
        //   Month_Year: "2021-07-01",
        //   type: "iudx",
        //   monthly_average_pm25: "10.75",
        // },
        // {
        //   Month_Year: "2021-08-01",
        //   type: "iudx",
        //   monthly_average_pm25: "16.08",
        // },
        // {
        //   Month_Year: "2021-09-01",
        //   type: "iudx",
        //   monthly_average_pm25: "13.25",
        // },
        // {
        //   Month_Year: "2021-10-01",
        //   type: "iudx",
        //   monthly_average_pm25: "23.24",
        // },
      ],
      // rankedWards: [],
      rankedWards: [
        {
          location_id: "s_shiv",
          name: "Shivajinagar",
          datasource: "SAFAR",
          Average_pm25: "92.40",
          best: 10,
        },
        {
          location_id: "s_bhos",
          name: "Bhosari",
          datasource: "SAFAR",
          Average_pm25: "83.26",
          best: 9,
        },
        {
          location_id: "s_niga",
          name: "Nigadi",
          datasource: "SAFAR",
          Average_pm25: "79.35",
          best: 8,
        },
        {
          location_id: "s_alan",
          name: "Alandi",
          datasource: "SAFAR",
          Average_pm25: "61.69",
          best: 3,
        },
        {
          location_id: "s_hada",
          name: "Hadapsar",
          datasource: "SAFAR",
          Average_pm25: "60.86",
          best: 2,
        },
        {
          location_id: "s_pash",
          name: "Pashan",
          datasource: "SAFAR",
          Average_pm25: "49.25",
          best: 1,
        },
      ],
    };
  }

  // Get top 3 and bottom 3 ranks for pollutants
  async getWard_pm25Ranks() {
    // let today = new Date(); // TODO get this date from UI components
    const payload = { startDate: "2021-04-23", endDate: "2021-11-16" };

    // retrieving data
    const url = "http://localhost:5600/API/top10_pm25";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    const response = await fetch(url, requestOptions);

    //processing retrieved data
    const rankedWards = await response.json();
    console.log(" * * * * Ranked wards received from db * * * * ", rankedWards);

    this.setState({
      rankedWards: rankedWards.data,
      loading: false,
    });
  }

  async getWardPolygons() {
    // TODO get this date from UI components
    let today = new Date("2021-06-06");
    const payload = {
      date1: today.toISOString().split("T")[0],
      categories: ["iudx", "safar", "ward"],
    };

    // retrieving data
    const url = "http://localhost:5600/API/wardPolygons";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    const response = await fetch(url, requestOptions);

    //processing retrieved data
    const wardPolygons = await response.json();
    console.log(
      " * * * * Geo mapped pollutants received from db * * * * ",
      wardPolygons
    );

    this.setState({
      //pollutant_geolocations: wardPolygons.data,
      wardPolygons: wardPolygons,
    });
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

  /*
   * FETCHING DATA FROM API
   * This is where all the api calls are made to get data from the server
   */
  componentDidMount() {
    // HORIZONTAL BAR CHART TOOL
    // this.getWard_pm25Ranks();
    // MAPTOOL
    // this.getWardPolygons();
    //LINE CHART TOOL
    // this.getPollutantHistory(); //TODO paramterize pollutant
  }

  render() {
    let today = new Date();

    const ui = (
      <>
        <div>{"This is a map of Pune."}</div>

        {this.state.loading ? (
          "Retrieving data . . ."
        ) : (
          <SVGContainer>
            <BarchartToolHorizontal
              title={
                "Top 3 Wards showing the lowest to highest levels of pm2.5 for " +
                today.toDateString().slice(4, 7) +
                " " +
                today.toDateString().slice(11)
              }
              rankedWards={this.state.rankedWards}
            ></BarchartToolHorizontal>
          </SVGContainer>
        )}

        <ReactMapTool shapes={this.state.wardPolygons.shapes}></ReactMapTool>

        <SVGContainer>
          <LinechartTool
            title={"PM2.5 history for IUDX, SAFAR and Wards"}
            pollutantHistory={this.state.pollutantHistory}
          ></LinechartTool>
        </SVGContainer>
      </>
    );

    return <div className="vizpanel">{ui}</div>;
  }
}
