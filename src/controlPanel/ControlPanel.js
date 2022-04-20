import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import { Button, ButtonGroup } from "react-bootstrap";

import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class ControlPanel extends React.Component {
  unitSelectRef = null;
  pollutantSelectRef = null;

  constructor(props) {
    super(props);

    this.state = {
      selectedDataSourceId: 0,
      filteredMonitors: [],
      startDate: new Date("2021-04-24"),
      endDate: new Date(),
      // wardsAndMonitors: [],
      wardsAndMonitors: [
        { label: "WARD1", value: "WARD1", type: "WARD" },
        { label: "WARD2", value: "WARD2", type: "WARD" },
        { label: "WARD3", value: "WARD3", type: "WARD" },
        { label: "SAFAR1", value: "SAFAR1", type: "SAFAR" },
        { label: "IUDX1", value: "IUDX1", type: "IUDX" },
        { label: "MPCB1", value: "MPCB1", type: "MPCB" },
      ],
    };
  }

  /* Utility*/
  async getWardsAndMonitors() {
    // retrieving data
    const url = "http://localhost:5600/API/wardsAndMonitors";
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
      (monitor) => monitor.type === toFilterBy
    );
  }

  /* * Setters */

  setStartDate(date) {
    console.log("Calendar stuff", date, date.toISOString().substring(0, 10));
    this.setState({
      startDate: date,
    });
  }

  setEndDate(date) {
    console.log("Calendar stuff", date, date.toISOString().substring(0, 10));
    this.setState({
      endDate: date,
    });
  }

  setSelectedMode = (e, i) => {
    this.props.setSelectedMode(e);

    /*
    https://stackoverflow.com/questions/50412843/how-to-programmatically-clear-reset-react-select
    Only if a selection in the monitor dropdown has been made, clear it when a new datasource is selected
    because the options will repopulate 
    */
    if (this.unitSelectRef.state.selectValue.length > 0)
      this.unitSelectRef.clearValue();

    let filteredMonitors = this.filterWardsAndMonitors(e.target.value);

    this.setState({
      selectedDataSourceId: i,
      filteredMonitors: filteredMonitors,
    });
  };

  setSelectedWardOrMonitor = (e) => {};

  /* * * Lifecycle hooks */
  componentDidMount() {
    //This handles the data selection bug from DatePicker react widget
    if (this.state.startDate) {
      this.state.startDate.setHours(
        (+1 * this.state.startDate.getTimezoneOffset()) / 60
      );
    }
    const dataSources = ["WARD", "IUDX", "SAFAR", "MPCB"];

    //TESTING
    let wnm = this.state.wardsAndMonitors;
    let filteredMonitors = this.filterWardsAndMonitors(
      dataSources[this.state.selectedDataSourceId]
    );
    this.setState({
      filteredMonitors: filteredMonitors,
    });

    //FETCHING FROM SERVER
    // let wnm = this.getWardsAndMonitors();
    // wnm.then((value) => {
    //   let filteredMonitors = this.filterWardsAndMonitors(
    //     dataSources[this.state.selectedDataSourceId]
    //   );
    //   this.setState({
    //     filteredMonitors: filteredMonitors,
    //   });
    // });
  }

  render() {
    const dataSources = ["WARD", "IUDX", "SAFAR", "MPCB"];
    const buttons = (
      <>
        {dataSources.map((buttonLabel, i) => (
          <Button
            key={i}
            value={buttonLabel}
            onClick={(event) => this.setSelectedMode(event, i)}
            active={i === this.state.selectedDataSourceId ? true : false}
          >
            {buttonLabel}
          </Button>
        ))}
      </>
    );

    return (
      <div>
        <div className="controlpanel">
          <div className="controlPanelSection1">
            <ButtonGroup size="sm" className="cp-section1items">
              {buttons}
            </ButtonGroup>
            <Select
              ref={(ref) => {
                this.unitSelectRef = ref;
              }}
              className="cp-section1items"
              placeholder="Select a ward or monitor"
              // isDisabled={this.state.selectedDataSourceId != -1 ? false : true}
              options={this.state.filteredMonitors}
            />

            <Select
              ref={(ref) => {
                this.pollutantSelectRef = ref;
              }}
              className="cp-section1items"
              placeholder="Select a pollutant"
              // isDisabled={this.state.selectedDataSourceId != -1 ? false : true}
              // options={this.state.filteredMonitors}
            />
          </div>

          <div className="controlPanelSection2">
            <label className="cp-section2items"> From : </label>
            <DatePicker
              className="cp-section2items"
              dateFormat="yyyy/MM/dd"
              selected={this.state.startDate}
              onChange={(date) => this.setStartDate(date)}
            />
            <label className="cp-section2items"> To : </label>
            <DatePicker
              className="cp-section2items"
              dateFormat="yyyy/MM/dd"
              selected={this.state.endDate}
              onChange={(date) => this.setEndDate(date)}
            />
            <Button variant="dark" size="sm" className="cp-section2items">
              Update
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
