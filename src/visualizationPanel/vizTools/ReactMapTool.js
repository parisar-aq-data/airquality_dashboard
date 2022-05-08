import {
  MapContainer,
  TileLayer,
  Polygon,
  LayerGroup,
  CircleMarker,
  Popup,
  LayersControl,
  useMap,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MonitorView(props) {
  const map = useMap();

  // finding the matching shape data for the matched feature
  let matchedFeature = props.wardsAndMonitors.find(
    (feat) => feat.name === props.selectedWardOrMonitor
  );

  console.log("matched feature", matchedFeature);

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

export default function ReactMapTool(props) {
  let features = [];
  let polygons = [];
  let iudxMarkers = [];
  let safarMarkers = [];

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
      if (!d) return "#9c9c9c";
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
      polygons.push(
        <Polygon
          key={index}
          pathOptions={{
            color: "#0E86D4",
            fillColor: colorMapper(feat.properties.average_daily_pm25),
            fillOpacity: 0.7,
          }}
          positions={feat.geometry.coordinates[0]}
        >
          <Tooltip sticky>
            WARD : {feat.properties.name} <br />
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
    const fillIudx = { color: "green", fillColor: "green" };
    const fillSafar = { color: "red", fillColor: "red" };

    const iudxMonitors = props.monitors.filter(
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
    // console.log("SAFAR", safarMonitors);
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
      <LayersControl position="topright">
        <LayersControl.Overlay checked={false} name="IUDX Monitors">
          <LayerGroup>{iudxMarkers}</LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked={true} name="Safar Monitors">
          <LayerGroup>{safarMarkers}</LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
}
