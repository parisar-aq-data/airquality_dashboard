/*
Controls the side control panel and the viz Panel
*/
import React from "react";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as paths from "./paths";

import VizPanel from "./visualizationPanel/VizPanel.js";
import logo from "./assets/ParisarLogo.png";

import { Nav, Navbar, Container, Alert } from "react-bootstrap";

import ControlPanel from "./controlPanel/ControlPanel";
import { Faq } from "./routes/Faq";
import { Contact } from "./routes/Contact";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMode: { name: "Satellite Based", type: "WARD" },
      selectedWardOrMonitor: "",
      panCityView: true,
      wardOrMonitorHistory: [],
      wardOrMonitorSummary: [],
      wardPolygons: [],
      rankedWards: [],
      startDate: new Date("2021-04-24"),
      endDate: new Date(),
      alert: {
        alertRaised: false,
        alertMessage: "",
      },
    };
  }

  updateDates = (e) => {
    // Fetching NEW data according to UPDATED DATES
    this.get_pm25Ranks();
    if (this.state.selectedWardOrMonitor !== "") {
      this.getWardOrMonitorHistory();
      this.getWardOrMonitorSummary();
    }
  };

  // Get top 3 and bottom 3 ranks for pollutants
  async get_pm25Ranks() {
    let message = "";

    const payload = {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      selectedMode: this.state.selectedMode.type,
    };

    // retrieving data
    const url = paths.RANKEDUNITS;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    const response = await fetch(url, requestOptions);

    //processing retrieved data
    const responseObject = await response.json();
    console.log(
      " * * * * Ranked " +
        this.state.selectedMode.name +
        " received from db * * * * ",
      responseObject
    );

    if (responseObject.status === "success") {
      this.setState({
        rankedWards: responseObject.data,
      });
    } else {
      if (responseObject.message === "No data found in DB") {
        message =
          "Sorry! We do not have the data for the selected date ranges. Please try changing them.";
      }

      this.setState({
        alert: {
          alertMessage: message,
          alertRaised: true,
        },
      });
    }
  }

  async getWardOrMonitorHistory() {
    let message = "";

    const payload = {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      selectedMode: this.state.selectedMode.type,
      selectedWardOrMonitor: this.state.selectedWardOrMonitor,
    };

    // retrieving data
    const url = paths.WARDORMONITORHISTORY;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    const response = await fetch(url, requestOptions);
    //processing retrieved data
    const responseObject = await response.json();
    console.log(
      " * * * * History for " +
        payload.selectedMode +
        payload.selectedWardOrMonitor +
        " received from db * * * * ",
      responseObject
    );

    if (responseObject.status === "success") {
      this.setState({
        wardOrMonitorHistory: responseObject.data,
      });
    } else {
      if (responseObject.message === "No data found in DB") {
        message =
          "Sorry! We do not have the data for the selected monitor or ward or the date ranges. Please try changing them.";
      }

      this.setState({
        alert: {
          alertMessage: message,
          alertRaised: true,
        },
      });
    }
  }

  async getWardPolygons() {
    let wardPolygons = this.state.wardPolygons;
    if (this.state.wardPolygons.length !== 101) {
      // TODO get this date from UI components
      let today = new Date("2021-06-06");
      const payload = {
        date1: today.toISOString().split("T")[0],
        categories: ["iudx", "safar", "ward", "mpcb"],
      };

      // retrieving data
      const url = paths.WARDPOLYGONS;
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      };
      const response = await fetch(url, requestOptions);

      //processing retrieved data
      wardPolygons = await response.json();
      console.log(
        " * * * * POLYGONS with pollutants received from db * * * * ",
        wardPolygons
      );
    }

    this.setState({
      wardPolygons: wardPolygons,
    });
  }

  async getWardOrMonitorSummary() {
    let message = "";

    const payload = {
      startDate: this.state.startDate.toISOString().split("T")[0], // getting a MYSQL date truncate issue if date not formatted this way
      endDate: this.state.endDate.toISOString().split("T")[0],
      selectedMode: this.state.selectedMode.type,
      selectedWardOrMonitor: this.state.selectedWardOrMonitor,
    };

    // retrieving data
    const url = paths.WARDORMONITORSUMMARY;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    const response = await fetch(url, requestOptions);

    //processing retrieved data
    const responseObject = await response.json();
    console.log(
      " * * * * Summary for " +
        this.state.selectedWardOrMonitor +
        " received from db * * * * ",
      responseObject
    );

    if (responseObject.status === "success") {
      this.setState({
        wardOrMonitorSummary: responseObject.data, // only 1 record is always returned
      });
    } else {
      if (responseObject.message === "No data found in DB") {
        message =
          "Sorry! We do not have the data for the selected date ranges. Please try changing them.";
      }

      this.setState({
        alert: {
          alertMessage: message,
          alertRaised: true,
        },
      });
    }
  }

  /*
   * FETCHING DATA FROM API
   * This is where all the api calls are made to get data from the server
   */
  componentDidMount() {
    // HORIZONTAL BAR CHART TOOL
    this.get_pm25Ranks();
    // MAPTOOL
    this.getWardPolygons();
  }

  componentDidUpdate(prevProps, prevState) {
    // TODO get this verified
    // Fetching NEW data according to UPDATED SELECTED MODE
    if (this.state.selectedMode !== prevState.selectedMode) {
      this.get_pm25Ranks();
    }
    if (
      this.state.selectedWardOrMonitor !== prevState.selectedWardOrMonitor &&
      this.state.selectedWardOrMonitor !== ""
    ) {
      this.getWardOrMonitorHistory();
      this.getWardOrMonitorSummary();
    }
  }

  handleAlerts = (status) => {
    this.setState({
      alert: {
        alertMessage: "",
        alertRaised: status,
      },
    });
  };

  handlePanCityView = () => {
    this.setState({
      panCityView: !this.state.panCityView,
    });
  };

  setSelectedWardOrMonitor = (e) => {
    this.setState({
      selectedWardOrMonitor: e.value,
    });
  };
  render() {
    const content = (
      <>
        {this.state.alert.alertRaised ? (
          <Alert
            variant="danger"
            onClose={() => this.handleAlerts(false)}
            dismissible
          >
            <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
            <p>{this.state.alert.alertMessage}</p>
          </Alert>
        ) : null}
        <ControlPanel
          panCityView={this.state.panCityView}
          updateDates={this.updateDates}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          selectedWardOrMonitor={this.state.selectedWardOrMonitor}
          setSelectedMode={(selectedMode) => {
            this.setState({
              selectedMode: selectedMode,
              selectedWardOrMonitor: "",
            });
          }}
          setSelectedWardOrMonitor={this.setSelectedWardOrMonitor}
          handlePanCityView={this.handlePanCityView}
          // getWardOrMonitorHistory={this.getWardOrMonitorHistory.bind(this)}
          setStartDate={(date) => this.setState({ startDate: date })}
          setEndDate={(date) => this.setState({ endDate: date })}
        />
        {false ? (
          "Retrieving data . . ."
        ) : (
          <VizPanel
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            selectedMode={this.state.selectedMode}
            panCityView={this.state.panCityView}
            selectedWardOrMonitor={this.state.selectedWardOrMonitor}
            rankedWards={this.state.rankedWards}
            wardOrMonitorHistory={this.state.wardOrMonitorHistory}
            wardOrMonitorSummary={this.state.wardOrMonitorSummary}
            wardPolygons={this.state.wardPolygons}
          />
        )}
      </>
    );

    return (
      <div className="parentdiv">
        <Navbar bg="light">
          <Container>
            <Navbar.Brand>
              <img alt="" src={logo} className="logo" />
              <span className="websiteName">{"Air Quality Dashboard"}</span>
            </Navbar.Brand>
            <Nav className="justify-content-end">
              <Faq />
              <Contact />
            </Nav>
          </Container>
        </Navbar>
        <div className="content">{content}</div>
      </div>
    );
  }
}
