import React, { useRef, useState, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import Geocoder from "./Geocoder";
import "./MapGL.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export default function MapGL() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  const [lng, setLng] = useState(-0.5667);
  const [lat, setLat] = useState(44.8333);
  const [zoom, setZoom] = useState(12);

  // Set the map only once and the coordinates and zoom level every time the map moves
  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    // Add navigation control (the +/- zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");
  }, [lng, lat, zoom]);

  //import coordinates from Geocoder.js
  // const handleCoordinatesChange = (newCoordinates) => {
  //   if (
  //     newCoordinates &&
  //     newCoordinates.lng !== 0 &&
  //     newCoordinates.lat !== 0
  //   ) {
  //     //change coordinates in state (lng & lat) with the coordinates from Geocoder.js
  //     setLng(newCoordinates.lng);
  //     setLat(newCoordinates.lat);
  //   }
  // };

  const handleRetrieve = (selectedInfo) => {
    //initial marker
    marker.current = new mapboxgl.Marker({
      color: "yellow",
      draggable: false,
    })
      .setLngLat([selectedInfo.lng, selectedInfo.lat])
      .addTo(map.current);

    //add marker from the fetch coordinates
    // marker.current = new mapboxgl.Marker({
    //   color: "red",
    //   draggable: false,
    // })
    //   .setLngLat([data.lng, data.lat])
    //   .addTo(map.current);

    //flyto initial marker coordinates
    map.current.flyTo({
      center: [selectedInfo.lng, selectedInfo.lat],
      zoom: 14,
      essential: true,
      duration: 5000,
    });

    // TODO : Faire quelques chose avec les infos récupérées - à voir avec le back
    console.log("selectedInfo on MapboxGL", selectedInfo);
  };

  return (
    <div>
      <div className="main">
        <div ref={mapContainer} className="map-container" />
        <div>
          <Geocoder
            // onCoordinatesChange={handleCoordinatesChange}
            onRetrieve={handleRetrieve}
          />
        </div>
      </div>
    </div>
  );
}
