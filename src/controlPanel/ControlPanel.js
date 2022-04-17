import "bootstrap/dist/css/bootstrap.min.css";
import { Button, ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap";
import React from "react";

export default class ControlPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDataSourceId: -1,
      selectedMonitor: "Select an air pollution Ward or Monitor",
      wardsAndMonitors: [],
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
    // this.getWardsAndMonitors();
  }

  setSelectedMode = (e, i) => {
    this.props.setSelectedMode(e);
    this.setState({
      selectedDataSourceId: i,
      selectedMonitor: "Select an air pollution Ward or Monitor",
    });
  };

  setSelectedWardOrMonitor = (e) => {
    this.setState({ selectedMonitor: e.target.innerText });
  };

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

    // const x = this.state.wardsAndMonitors;

    const x = [
      { name: "WARD1", type: "WARD" },
      { name: "WARD2", type: "WARD" },
      { name: "WARD3", type: "WARD" },
      { name: "SAFAR1", type: "SAFAR" },
      { name: "IUDX1", type: "IUDX" },
      { name: "MPCB1", type: "MPCB" },
    ];

    const dropDownItems = (
      <>
        {x.map((itemLabel, i) =>
          // filtering the dropdown list on the basis of the dataSource toggle
          itemLabel.type == dataSources[this.state.selectedDataSourceId] ? (
            <Dropdown.Item
              key={i}
              value={itemLabel}
              onClick={this.setSelectedWardOrMonitor}
            >
              {itemLabel.name}
            </Dropdown.Item>
          ) : null
        )}
      </>
    );

    return (
      <div className="controlpanel">
        <ButtonGroup size="sm" className="controlpanelitems">
          {buttons}
        </ButtonGroup>

        {[DropdownButton].map((DropdownType, idx) => (
          <DropdownType
            as={ButtonGroup}
            key={idx}
            id={`dropdown-button-drop-${idx}`}
            disabled={this.state.selectedDataSourceId != -1 ? false : true}
            size="sm"
            title={this.state.selectedMonitor}
            style={{ marginRight: 5 }}
          >
            {dropDownItems}
          </DropdownType>
        ))}
      </div>
    );
  }
}
