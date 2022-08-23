import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import "./MapLocation.css";
import Geolocation from "ol/Geolocation";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";

function MapLocation() {
  const ref = useRef(null);
  const mapRef = useRef(null);
  const [geolocation, setGeoLocation] = useState({});
  const [posFeature, setPosFeature] = useState(new Feature());
  const [viewPoint, setViewPoint] = useState(
    new View({
      center: [0, 0],
      zoom: 2,
    })
  );

  useEffect(() => {
    if (ref.current && !mapRef.current) {
      setGeoLocation(
        new Geolocation({
          tracking: true,
          trackingOptions: {
            enableHighAccuracy: true,
          },
          projection: viewPoint.getProjection(),
        })
      );

      const positionFeature = new Feature();
      positionFeature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 4,
            fill: new Fill({
              color: "red",
            }),
            stroke: new Stroke({
              color: "#7CFC00",
              width: 2,
            }),
          }),
        })
      );
      setPosFeature(positionFeature);

      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: [positionFeature],
        }),
      });

      const map = new Map({
        layers: [new TileLayer({ source: new OSM() }), vectorLayer],
        view: viewPoint,
        target: ref.current,
      });

      mapRef.current = map;
    }
  }, []);

  const markMyLocation = () => {
    alert("Your Location coordinates " + geolocation.getPosition());
    const coordinates = geolocation.getPosition();
    setViewPoint(
      new View({
        center: coordinates,
        zoom: 2,
      })
    );
    posFeature.setGeometry(coordinates ? new Point(coordinates) : null);
  };

  return (
    <>
      <button className="btn" onClick={markMyLocation}>
        My Location
      </button>
      <div ref={ref} className="map"></div>
    </>
  );
}

export default MapLocation;
