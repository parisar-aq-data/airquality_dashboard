import "bootstrap/dist/css/bootstrap.min.css";
import { Button, ButtonGroup } from "react-bootstrap";
import React from "react";
import Select from "react-select";

export default class ControlPanel extends React.Component {
  selectRef = null;

  constructor(props) {
    super(props);

    this.state = {
      selectedDataSourceId: -1,
      selectedMonitor: "Select an air pollution Ward or Monitor",
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
  }

  componentDidMount() {
    this.getWardsAndMonitors();
  }

  setSelectedMode = (e, i) => {
    this.props.setSelectedMode(e);

    /*
    https://stackoverflow.com/questions/50412843/how-to-programmatically-clear-reset-react-select
    Only if a selection in the monitor dropdown has been made, clear it when a new datasource is selected
    because the options will repopulate 
    */
    if (this.selectRef.state.selectValue.length > 0)
      this.selectRef.clearValue();

    let filteredMonitors = this.state.wardsAndMonitors.filter(
      (monitor) => monitor.type == e.target.value
    );

    this.setState({
      selectedDataSourceId: i,
      filteredMonitors: filteredMonitors,
    });
  };

  setSelectedWardOrMonitor = (e) => {};

  render() {
    const dataSources = ["IUDX", "WARD", "SAFAR", "MPCB"];
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
      <div className="controlpanel">
        <ButtonGroup size="sm" className="controlpanelitems">
          {buttons}
        </ButtonGroup>

        <Select
          ref={(ref) => {
            this.selectRef = ref;
          }}
          className="basic-single controlpanelitems"
          isDisabled={this.state.selectedDataSourceId != -1 ? false : true}
          options={this.state.filteredMonitors}
        />
      </div>
    );
  }
}
