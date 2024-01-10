import {
  MapContainer,
  TileLayer,
  Polygon,
  LayerGroup,
  CircleMarker,
  LayersControl,
  useMap,
  Tooltip,
} from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function MonitorView(props) {
  const map = useMap();

  let matchedFeature = props.wardsAndMonitors.find(
    (feat) =>
      feat.name.toUpperCase() === props.selectedWardOrMonitor.toUpperCase()
  );

  let [centerX, centerY] = [
    parseFloat(matchedFeature.lat),
    parseFloat(matchedFeature.lon),
  ];

  map.setView([centerX, centerY], 14);

  return null;
}

function PanCityView(props) {
  const map = useMap();
  map.setView([18.502, 73.853], 12);
  return null;
}

function Legend({}) {
  const map = useMap();

  const getColor = (d) => {
    // return d > 35
    //   ? "#800026"
    //   : d > 30
    //   ? "#BD0026"
    //   : d > 25
    //   ? "#E31A1C"
    //   : d > 20
    //   ? "#FEB24C"
    //   : d > 15
    //   ? "#FED976"
    //   : d > 10
    //   ? "#57C7DB"
    //   : d > 5
    //   ? "#90D6E2"
    //   : "#CAECF1";
    if (!d) return "#ededed";
    return d > 250
      ? "#810100"
      : d > 120
      ? "#c41206"
      : d > 90
      ? "#f58f09"
      : d > 60
      ? "#CCA88A"
      : d > 30
      ? "#1E5E64"
      : "#50C3CD";
  };

  useEffect(() => {
    if (map) {
      const legend = L.control({ position: "bottomleft" });

      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "info legend");
        const grades = ["NA", 0, 30, 60, 90, 120, 250];
        const gradeNames = [
          "Not Available",
          "Good",
          "Satisfactory",
          "Moderate",
          "Poor",
          "Very Poor",
          "Severe",
        ];
        let labels = [];
        let from;
        let to;

        labels.push("<h5>PM 2.5</h5>");
        for (let i = 0; i < grades.length; i++) {
          from = grades[i];
          to = grades[i + 1];

          if (grades[i] === "NA") {
            labels.push(
              `<div style="display: flex; justify-content: space-between; align-items: center;padding:1px">
              <div>
              <i style="background: ${getColor(from + 1)};"></i> 
              ${from} ${to ? "&ndash;" + to : "+"} &nbsp;&nbsp;</div> 
              <span style="margin-left: 10px;"> 
              ${gradeNames[i]}
              </span>
              </div>
            `);
          } else {
            labels.push(`<div style="display: flex; justify-content: space-between; align-items: center;padding:1px">
           <div> <i style="background: ${getColor(from + 1)};"></i>
           ${from} ${to ? "&ndash;" + to : "+"} &nbsp;&nbsp;</div> 
              <span style="margin-left: 10px;">
                ${gradeNames[i]}
            </span>
        </div>
        `);
          }
        }
        div.innerHTML = labels.join("");
        return div;
      };

      legend.addTo(map);
    }
  }, [map]);
  return null;
}

export default function ReactMapTool(props) {
  let features = [];
  let polygons = [];
  let iudxMarkers = [];
  let safarMarkers = [];
  let mpcbMarkers = [];

  /* WARD POLYGONS */
  if (props.shapes) {
    features = props.shapes.features;

    // GEO JSON data is returned with x and y flipped
    for (let i = 0; i < features.length; i++) {
      let feat_coordinates = features[i].geometry.coordinates[0];
      for (let j = 0; j < feat_coordinates.length; j++) {
        feat_coordinates[j].reverse();
      }
    }

    function colorMapper(d) {
      if (!d) return "#ededed";
      return d > 250
        ? "#810100"
        : d > 120
        ? "#c41206"
        : d > 90
        ? "#f58f09"
        : d > 60
        ? "#CCA88A"
        : d > 30
        ? "#1E5E64"
        : "#50C3CD";
    }

    features.forEach((feat, index) => {
      polygons.push(
        <Polygon
          key={index}
          pathOptions={{
            color: "#777",
            fillColor: colorMapper(feat.properties.average_daily_pm25),
            fillOpacity: 0.5,
          }}
          positions={feat.geometry.coordinates[0]}
        >
          <Tooltip sticky>
            WARD <br />
            {feat.properties.name} <br />
            {feat.properties.name_mr} <br />
            {"PM2.5 :  "}
            {Number(parseFloat(feat.properties.average_daily_pm25)).toFixed(2)}
          </Tooltip>
        </Polygon>
      );
    });
  }

  /* IUDX MONITORS */
  if (props.monitors) {
    //1. filter iudx monitors
    const fillIudx = { color: "#3885e7", fillColor: "#3885e7" };
    const fillSafar = { color: "#c738e7", fillColor: "#c738e7" };
    const fillmpcb = { color: "#1eb708", fillColor: "#1eb708" };

    const iudxMonitors = props.monitors.filter(
      (monitor) => monitor.type === "iudx"
    );
    iudxMonitors.forEach((mon, index) => {
      iudxMarkers.push(
        <CircleMarker
          key={index}
          center={[mon.lat, mon.lon]}
          pathOptions={fillIudx}
          radius={10}
        >
          <Tooltip sticky>
            IUDX Monitor <br />
            {mon.name} <br />
            {"PM 2.5 :  "}
            {Number(parseFloat(mon.average_daily_pm25)).toFixed(2)}
          </Tooltip>
        </CircleMarker>
      );
    });

    //2. filter safar monitors
    const safarMonitors = props.monitors.filter(
      (monitor) => monitor.type === "safar"
    );
    safarMonitors.forEach((mon, index) => {
      safarMarkers.push(
        <CircleMarker
          key={index}
          center={[mon.lat, mon.lon]}
          pathOptions={fillSafar}
          radius={10}
        >
          <Tooltip sticky>
            Safar Monitor <br /> {mon.name} <br />
            {"PM 2.5 :  "}
            {Number(parseFloat(mon.average_daily_pm25)).toFixed(2)}
          </Tooltip>
        </CircleMarker>
      );
    });

    //3. filter MPCB monitors
    const mpcbMonitors = props.monitors.filter(
      (monitor) => monitor.type === "mpcb"
    );
    mpcbMonitors.forEach((mon, index) => {
      mpcbMarkers.push(
        <CircleMarker
          key={index}
          center={[mon.lat, mon.lon]}
          pathOptions={fillmpcb}
          radius={10}
        >
          <Tooltip sticky>
            MPCB Monitor <br /> {mon.name} <br />
            {"PM 2.5 :  "}
            {Number(parseFloat(mon.average_daily_pm25)).toFixed(2)}
          </Tooltip>
        </CircleMarker>
      );
    });
  }

  return (
    <MapContainer className="map_tool" scrollWheelZoom={false}>
      {props.panCityView ? (
        <PanCityView features={features} />
      ) : (
        <MonitorView
          wardsAndMonitors={props.monitors}
          selectedWardOrMonitor={props.selectedWardOrMonitor}
        />
      )}
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {polygons}
      <LayersControl position="bottomright">
        {/* <LayersControl.Overlay
          checked={props.selectedMode.type === "IUDX" ? true : false}
          name="Smart City Monitors"
        >
          <LayerGroup>{iudxMarkers}</LayerGroup>
        </LayersControl.Overlay> */}
        <LayersControl.Overlay
          checked={props.selectedMode.type === "SAFAR" ? true : false}
          name="Safar Monitors"
        >
          <LayerGroup>{safarMarkers}</LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay
          checked={props.selectedMode.type === "MPCB" ? true : false}
          name="MPCB Monitors"
        >
          <LayerGroup>{mpcbMarkers}</LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
      <Legend />
    </MapContainer>
  );
}
