import {
  MapContainer,
  TileLayer,
  Polygon,
  LayerGroup,
  CircleMarker,
  Popup,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";

export default class ReactMapTool2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ward: "",
      selectedMonitor: "",
    };
  }

  wardsCentroids = [];

  getWardPolygons() {
    //TODO check for pancityView
    let polygons = [];
    const features = this.props.shapes.features;

    // GEO JSON data is returned with x and y flipped
    for (let i = 0; i < features.length; i++) {
      let feat_coordinates = features[i].geometry.coordinates[0];
      for (let j = 0; j < feat_coordinates.length; j++) {
        feat_coordinates[j].reverse();
      }
    }

    function colorMapper(d) {
      // console.log("average_daily_pm25", d);
      if (!d) return "#9c9c9c";
      // return d > 250
      //   ? "#994C01"
      //   : d > 120
      //   ? "#C89866"
      //   : d > 90
      //   ? "#C9E3E7"
      //   : d > 60
      //   ? "#AAD9E6"
      //   : d > 30
      //   ? "#80C6E6"
      //   : "#80efff";
      return d > 30
        ? "#994C01"
        : d > 25
        ? "#C89866"
        : d > 23
        ? "#C9E3E7"
        : d > 20
        ? "#AAD9E6"
        : d > 13
        ? "#80C6E6"
        : "#80efff";
    }

    features.forEach((feat, index) => {
      // console.log("feat", feat);
      polygons.push(
        <Polygon
          key={index}
          pathOptions={{
            color: "#0E86D4",
            fillColor: colorMapper(feat.properties.average_daily_pm25),
            fillOpacity: 0.7,
          }}
          positions={feat.geometry.coordinates[0]}
        ></Polygon>
      );
    });
    return polygons;
  }

  getIudxMonitors() {
    //TODO check for pancityView
    let iudxMarkers = [];
    //1. filter iudx monitors
    const fillIudx = { color: "green", fillColor: "green" };
    const iudxMonitors = this.props.monitors.filter(
      (monitor) => monitor.type === "iudx"
    );
    // console.log("IUDX", iudxMonitors);
    iudxMonitors.forEach((mon, index) => {
      iudxMarkers.push(
        <CircleMarker
          key={index}
          center={[mon.lat, mon.lon]}
          pathOptions={fillIudx}
          radius={10}
        >
          <Popup>
            IUDX Monitor <br />
            {mon.name} <br />
            {"PM 2.5 :  "}
            {Number(parseFloat(mon.average_daily_pm25)).toFixed(2)}
          </Popup>
        </CircleMarker>
      );
    });
    return iudxMarkers;
  }

  getSafarMonitors() {
    //TODO check for pancityView
    let safarMarkers = [];
    const fillSafar = { color: "red", fillColor: "red" };

    //2. filter safar monitors
    const safarMonitors = this.props.monitors.filter(
      (monitor) => monitor.type === "safar"
    );
    // console.log("SAFAR", safarMonitors);
    safarMonitors.forEach((mon, index) => {
      safarMarkers.push(
        <CircleMarker
          key={index}
          center={[mon.lat, mon.lon]}
          pathOptions={fillSafar}
          radius={10}
        >
          <Popup>
            Safar Monitor <br /> {mon.name} <br />
            {"PM 2.5 :  "}
            {Number(parseFloat(mon.average_daily_pm25)).toFixed(2)}
          </Popup>
        </CircleMarker>
      );
    });

    return safarMarkers;
  }

  async getWardCentroids() {
    // retrieving data
    const url = "http://localhost:5600/API/wardCentroids";
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: null,
    };
    const response = await fetch(url, requestOptions);

    //processing retrieved data
    this.wardsCentroids = await response.json();
    console.log(" * * * * WARDS CENTROIDS * * * * ", this.wardsCentroids);
  }

  componentDidMount() {
    this.getWardCentroids();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.selectedWardOrMonitor !== prevProps.selectedWardOrMonitor) {
      if (this.props.selectedMode === "IUDX") {
        // set State of Maptool selectedMode and SelectedMonitor
        // which will cause rerndering
      } else if (this.props.selectedMode === "SAFAR") {
        // set State of Maptool selectedMode and SelectedMonitor
        // which will cause rerndering
      } else {
        // set State of Maptool selectedMode and SelectedMonitor
        // which will cause rerndering
      }
    }
  }

  render() {
    let polygons = [];
    let iudxMarkers = [];
    let safarMarkers = [];

    /* WARD POLYGONS */
    if (this.props.shapes) {
      polygons = this.getWardPolygons();
    }

    /* MONITORS */
    if (this.props.monitors) {
      iudxMarkers = this.getIudxMonitors();
      safarMarkers = this.getSafarMonitors();
    }

    const oo = (
      <>
        <MapContainer
          className="map_tool"
          center={this.props.center}
          zoom={12}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LayersControl position="topright">
            <LayerGroup>{polygons}</LayerGroup>
            <LayersControl.Overlay checked={false} name="IUDX Monitors">
              <LayerGroup>{iudxMarkers}</LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked={true} name="Safar Monitors">
              <LayerGroup>{safarMarkers}</LayerGroup>
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </>
    );

    return oo;
  }
}
