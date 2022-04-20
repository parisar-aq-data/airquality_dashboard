import {
  MapContainer,
  TileLayer,
  Polygon,
  LayerGroup,
  CircleMarker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function ReactMapTool(props) {
  // const pune_ward_centroids = "/assets/pune_2017_wards_centroids.geojson";
  const polygons = [];
  const iudxMarkers = [];
  const safarMarkers = [];

  /* WARD POLYGONS */
  if (props.shapes) {
    const features = props.shapes.features;

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
  }

  /* IUDX MONITORS */
  if (props.monitors) {
    //1. filter iudx monitors
    const fillIudx = { color: "green", fillColor: "green" };
    const fillSafar = { color: "red", fillColor: "red" };

    const iudxMonitors = props.monitors.filter(
      (monitor) => monitor.type == "iudx"
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
            {mon.name}
          </Popup>
        </CircleMarker>
      );
    });

    //2. filter safar monitors
    const safarMonitors = props.monitors.filter(
      (monitor) => monitor.type == "safar"
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
            Safar Monitor <br /> {mon.name}
          </Popup>
        </CircleMarker>
      );
    });
  }

  const oo = (
    <MapContainer center={[18.502, 73.853]} zoom={12} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {polygons}
      <LayerGroup>{iudxMarkers}</LayerGroup>

      <LayerGroup>{safarMarkers}</LayerGroup>
    </MapContainer>
  );

  return oo;
}
