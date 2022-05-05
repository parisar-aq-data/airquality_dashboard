/*
Controls the side control panel and the viz Panel 
*/
import React from "react";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import VizPanel from "./visualizationPanel/VizPanel.js";
import logo from "./assets/ParisarLogo.png";

import { Nav, Navbar, Container, Alert } from "react-bootstrap";
import ControlPanel from "./controlPanel/ControlPanel";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMode: "WARD",
      selectedWardOrMonitor: "",
      panCityView: true,
      wardOrMonitorHistory: [],
      wardPolygons: [],
      // rankedWards: [],
      rankedWards: [
        {
          location_id: "ward_10",
          name: "बावधन - कोथरुड डेपो",
          Average_pm25: "35.26",
          best: 37,
          worst: 1,
        },
        {
          location_id: "ward_11",
          name: "रामबाग कॉलनी-शिवतीर्थ नगर",
          Average_pm25: "35.04",
          best: 36,
          worst: 2,
        },
        {
          location_id: "ward_8",
          name: "औंध - बोपोडी",
          Average_pm25: "34.77",
          best: 35,
          worst: 3,
        },
        {
          location_id: "ward_40",
          name: "आंबेगांव दत्तनगर-कात्रज गावठाण",
          Average_pm25: "32.48",
          best: 3,
          worst: 35,
        },
        {
          location_id: "ward_41",
          name: "कोंढवा बुद्रुक - येवलेवाडी",
          Average_pm25: "32.43",
          best: 2,
          worst: 36,
        },
        {
          location_id: "ward_37",
          name: "अप्पर सुपर इंदिरा नगर",
          Average_pm25: "32.40",
          best: 1,
          worst: 37,
        },
      ],
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
    this.getWardOrMonitorHistory();
  };

  // Get top 3 and bottom 3 ranks for pollutants
  async get_pm25Ranks() {
    let message = "";

    const payload = {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      selectedMode: this.state.selectedMode,
    };

    // retrieving data
    const url = "http://localhost:5600/API/rankedPm25Units";
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
        this.state.selectedMode +
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
      selectedMode: this.state.selectedMode,
      selectedWardOrMonitor: this.state.selectedWardOrMonitor,
    };

    // retrieving data
    const url = "http://localhost:5600/API/getWardOrMonitorHistory";
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
    let message = "";

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
      " * * * * POLYGONS with pollutants received from db * * * * ",
      wardPolygons
    );

    this.setState({
      wardPolygons: wardPolygons,
    });
  }

  /*
   * FETCHING DATA FROM API
   * This is where all the api calls are made to get data from the server
   */
  componentDidMount() {
    // HORIZONTAL BAR CHART TOOL
    // this.get_pm25Ranks();
    // MAPTOOL
    this.getWardPolygons();
  }

  componentDidUpdate(prevProps, prevState) {
    // TODO get this verified
    // Fetching NEW data according to UPDATED SELECTED MODE
    if (this.state.selectedMode !== prevState.selectedMode) {
      this.get_pm25Ranks();
    }
    if (this.state.selectedWardOrMonitor !== prevState.selectedWardOrMonitor) {
      //console.log("in component did update", this.state.selectedWardOrMonitor);
      this.getWardOrMonitorHistory();
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
          setSelectedMode={(e) =>
            this.setState({
              selectedMode: e.target.value,
              selectedWardOrMonitor: "",
            })
          }
          setSelectedWardOrMonitor={this.setSelectedWardOrMonitor}
          handlePanCityView={this.handlePanCityView}
          getWardOrMonitorHistory={this.getWardOrMonitorHistory.bind(this)}
          setStartDate={(date) => this.setState({ startDate: date })}
          setEndDate={(date) => this.setState({ endDate: date })}
        />
        {this.state.rankedWards.length < 1 ? (
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
            wardPolygons={this.state.wardPolygons}
          />
        )}
      </>
    );

    return (
      <div className="parentdiv">
        <Navbar bg="light">
          <Container>
            <Navbar.Brand href="#home">
              <img alt="" src={logo} className="logo" /> Air Quality Dashboard
            </Navbar.Brand>

            <Nav className="justify-content-end">
              <Nav.Link href="#home">About</Nav.Link>
              <Nav.Link href="#features">Contact Us</Nav.Link>
              <Nav.Link href="#pricing">Analysis</Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        <div className="content">{content}</div>
      </div>
    );
  }
}
