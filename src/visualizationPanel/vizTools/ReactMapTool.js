import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function ReactMapTool(props) {
  // const pune_ward_centroids = "/assets/pune_2017_wards_centroids.geojson";
  const polygons = [];

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
      console.log("average_daily_pm25", d);
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
      console.log("feat", feat);
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

  const oo = (
    <MapContainer center={[18.502, 73.853]} zoom={11} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {polygons}
    </MapContainer>
  );

  return oo;
}
