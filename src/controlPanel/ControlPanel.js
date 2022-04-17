import "bootstrap/dist/css/bootstrap.min.css";
import { Button, ButtonGroup } from "react-bootstrap";
import React from "react";

export default class ControlPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clickedId: -1,
    };
  }

  async getWards() {}

  componentDidMount() {
    this.getWards();
  }

  setSelectedMode = (e, i) => {
    this.props.setSelectedMode(e);

    // console.log("Active Button is", e.target.value, i);
    this.setState({ clickedId: i });
  };

  render() {
    const button_names = ["IUDX", "WARDS", "SAFAR"];

    const buttons = (
      <>
        {button_names.map((buttonLabel, i) => (
          <Button
            key={i}
            value={buttonLabel}
            onClick={(event) => this.setSelectedMode(event, i)}
            active={i === this.state.clickedId ? true : false}
          >
            {buttonLabel}
          </Button>
        ))}
      </>
    );

    return (
      <div className="controlpanel">
        <ButtonGroup size="sm">{buttons}</ButtonGroup>
      </div>
    );
  }
}
