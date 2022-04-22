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
      selectedMode: "IUDX",
      startDate: new Date("2021-04-24"),
      endDate: new Date(),
      alert: {
        alertRaised: false,
        alertMessage: "",
      },
    };
  }

  /* * Setters */

  setStartDate = (date) => {
    // console.log("Calendar stuff", date, date.toISOString().substring(0, 10));
    this.setState({
      startDate: date,
    });
  };

  setEndDate = (date) => {
    // console.log("Calendar stuff", date, date.toISOString().substring(0, 10));
    this.setState({
      endDate: date,
    });
  };

  setSelectedMode = (e) => {
    // console.log(
    //   "Calling handleselectedMode in App.js and Setting value to ",
    //   e.target.value
    // );
    this.setState({
      selectedMode: e.target.value,
    });
  };

  updateDates = (e) => {
    console.log("NEW DATES", this.state.startDate, this.state.endDate);

    console.log("GETTING UPDATING WARDS");
    this.getWard_pm25Ranks();
  };

  // Get top 3 and bottom 3 ranks for pollutants
  async getWard_pm25Ranks() {
    let message = "";

    const payload = {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
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
      " * * * * Ranked wards received from db * * * * ",
      responseObject
    );

    if (responseObject.status == "success") {
      this.setState({
        rankedWards: responseObject.data,
      });
    } else {
      if (responseObject.message == "No data found in DB") {
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
    this.getWard_pm25Ranks();
    // MAPTOOL
    // this.getWardPolygons();
    //LINE CHART TOOL
    // this.getPollutantHistory(); //TODO paramterize pollutant
  }

  handleAlerts = (status) => {
    this.setState({
      alert: {
        alertMessage: "",
        alertRaised: status,
      },
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
          updateDates={this.updateDates}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          setSelectedMode={this.setSelectedMode}
          setStartDate={this.setStartDate}
          setEndDate={this.setEndDate}
        />
        {!this.state.rankedWards ? (
          "Retrieving data . . ."
        ) : (
          <VizPanel
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            selectedMode={this.state.selectedMode}
            rankedWards={this.state.rankedWards}
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
