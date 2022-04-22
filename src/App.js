/*
Controls the side control panel and the viz Panel 
*/
import React from "react";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import VizPanel from "./visualizationPanel/VizPanel.js";
import logo from "./assets/ParisarLogo.png";

import { Nav, Navbar, Container } from "react-bootstrap";
import ControlPanel from "./controlPanel/ControlPanel";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMode: "IUDX",
      startDate: new Date("2021-04-24"),
      endDate: new Date(),
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

  render() {
    const content = (
      <>
        <ControlPanel
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          setSelectedMode={this.setSelectedMode}
          setStartDate={this.setStartDate}
          setEndDate={this.setEndDate}
        />
        <VizPanel selectedMode={this.state.selectedMode} />
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
