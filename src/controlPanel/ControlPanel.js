import React from "react";
import * as paths from "./../paths";

import "bootstrap/dist/css/bootstrap.min.css";
import { Button, ButtonGroup } from "react-bootstrap";

import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const dataSources = [
  { name: "Satellite Based", type: "WARD" },
  { name: "Smart City", type: "IUDX" },
  { name: "SAFAR", type: "SAFAR" },
  { name: "MPCB", type: "MPCB" },
];

export default class ControlPanel extends React.Component {
  unitSelectRef = null;
  pollutantSelectRef = null;

  constructor(props) {
    super(props);

    this.state = {
      selectedDataSourceId: 0,
      filteredMonitors: [],
      wardsAndMonitors: [],
      // wardsAndMonitors: [
      //   { label: "WARD1", value: "WARD1", type: "WARD" },
      //   { label: "WARD2", value: "WARD2", type: "WARD" },
      //   { label: "WARD3", value: "WARD3", type: "WARD" },
      //   { label: "SAFAR1", value: "SAFAR1", type: "SAFAR" },
      //   { label: "IUDX1", value: "IUDX1", type: "IUDX" },
      //   { label: "MPCB1", value: "MPCB1", type: "MPCB" },
      // ],
    };
  }

  /* Utility*/
  async getWardsAndMonitors() {
    // retrieving data
    const url = paths.WARDSANDMONITORS;
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: null,
    };
    const response = await fetch(url, requestOptions);

    //processing retrieved data
    const wardsAndMonitors = await response.json();
    console.log(" * * * * WARDS AND MONITORS * * * * ", wardsAndMonitors);

    this.setState({
      wardsAndMonitors: wardsAndMonitors.data,
    });

    return wardsAndMonitors;
  }

  filterWardsAndMonitors(toFilterBy) {
    return this.state.wardsAndMonitors.filter(
      (monitor) => monitor.type === toFilterBy.type
    );
  }

  /* * Setters */

  setStartDate = (date) => {
    this.props.setStartDate(date);
  };

  setEndDate = (date) => {
    this.props.setEndDate(date);
  };

  setSelectedMode = (e, i) => {
    let selectedMode = dataSources.find((ds) => ds.name === e.target.value);
    this.props.setSelectedMode(selectedMode);

    /*
    https://stackoverflow.com/questions/50412843/how-to-programmatically-clear-reset-react-select
    Only if a selection in the monitor dropdown has been made, clear it when a new datasource is selected
    because the options will repopulate 
    */
    if (this.unitSelectRef.state.selectValue.length > 0)
      this.unitSelectRef.clearValue();

    let filteredMonitors = this.filterWardsAndMonitors(selectedMode);

    this.setState({
      selectedDataSourceId: i,
      filteredMonitors: filteredMonitors,
    });
  };

  setSelectedWardOrMonitor = (e) => {
    this.props.setSelectedWardOrMonitor(e);
    this.props.handlePanCityView();
  };

  /* * * Lifecycle hooks */
  componentDidMount() {
    //This handles the data selection bug from DatePicker react widget
    if (this.state.startDate) {
      this.state.startDate.setHours(
        (+1 * this.state.startDate.getTimezoneOffset()) / 60
      );
    }
    // const dataSources = ["WARD", "IUDX", "SAFAR", "MPCB"];

    //TESTING
    // let wnm = this.state.wardsAndMonitors;
    // let filteredMonitors = this.filterWardsAndMonitors(
    //   dataSources[this.state.selectedDataSourceId]
    // );
    // this.setState({
    //   filteredMonitors: filteredMonitors,
    // });

    //FETCHING FROM SERVER
    let wnm = this.getWardsAndMonitors();
    wnm.then((value) => {
      let filteredMonitors = this.filterWardsAndMonitors(
        dataSources[this.state.selectedDataSourceId]
      );
      this.setState({
        filteredMonitors: filteredMonitors,
      });
    });
  }

  render() {
    const buttons = (
      <>
        {dataSources.map((ds, i) => (
          <Button
            key={i}
            style={{ fontSize: "12px" }}
            value={ds.name}
            onClick={(event) => this.setSelectedMode(event, i)}
            active={i === this.state.selectedDataSourceId ? true : false}
          >
            {ds.name}
          </Button>
        ))}
      </>
    );

    return (
      <div>
        <div className="controlpanel">
          <div className="controlPanelSection1">
            {this.props.panCityView ? (
              <div className="panCityControl" style={{ zIndex: 999 }}>
                <ButtonGroup size="sm" className="cp-section1items">
                  {buttons}
                </ButtonGroup>
                <Select
                  ref={(ref) => {
                    this.unitSelectRef = ref;
                  }}
                  className="cp-section1items datasource-select"
                  isSearchable={true}
                  placeholder="Select a ward or monitor"
                  options={this.state.filteredMonitors}
                  onChange={this.setSelectedWardOrMonitor}
                />
              </div>
            ) : (
              <div className="panCityControl">
                <Button variant="link" onClick={this.props.handlePanCityView}>
                  Back to Pune City
                </Button>
                <div>
                  {/* {"Selected "}
                  {this.state.selectedDataSourceId === 0
                    ? "ward : "
                    : dataSources[this.state.selectedDataSourceId] +
                      " monitor : "} */}
                  &emsp; &emsp;&emsp; &emsp;
                  {dataSources[this.state.selectedDataSourceId].type +
                    "  : " +
                    this.props.selectedWardOrMonitor}
                </div>
              </div>
            )}
            {/* <Select
              ref={(ref) => {
                this.pollutantSelectRef = ref;
              }}
              className="cp-section1items"
              placeholder="Select a pollutant"
            /> */}
          </div>

          <div className="controlPanelSection2">
            <DatePicker
              wrapperClassName="cp-section2items"
              // dateFormat="yyyy/MM/dd"
              dateFormat="dd/MM/yyyy"
              selected={this.props.startDate}
              onChange={(date) => this.setStartDate(date)}
            />
            <label className="cp-section2items"> - </label>
            <DatePicker
              wrapperClassName="cp-section2items"
              dateFormat="dd/MM/yyyy"
              selected={this.props.endDate}
              onChange={(date) => this.setEndDate(date)}
            />
            <Button
              variant="dark"
              size="sm"
              className="cp-section2items"
              onClick={this.props.updateDates}
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
