import React, { useState, useEffect } from "react";
import { SearchBox } from "@mapbox/search-js-react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import "./Geocoder.css";

function Geocoder(props) {
  const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
  const [value, setValue] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({
    lng: 0,
    lat: 0,
  });
  const [schoolType, setSchoolType] = useState("maternelle");
  const [schoolStatus, setSchoolStatus] = useState("école-publique");
  const [distance, setDistance] = useState("1");

  const handleChange = (e) => {
    setValue(e);
  };

  const handleSchoolTypeChange = (event) => {
    setSchoolType(event.target.value);
  };

  const handleSchoolStatusChange = (event) => {
    setSchoolStatus(event.target.value);
  };

  const handleDistanceChange = (event) => {
    setDistance(event.target.value);
  };

  const handleRetrieve = (suggestions) => {
    // console.log("suggestions", suggestions);

    // check if suggestions is true
    if (suggestions) {
      // console.log(" suggestions true");

      //save the coordinates in the State coordinates
      setCoordinates({
        lng: suggestions.features[0].geometry.coordinates[0],
        lat: suggestions.features[0].geometry.coordinates[1],
      });

      //save the address in the State address
      setAddress(suggestions.features[0].properties.full_address);
    }
  };

  //create a new object with the coordinates and the selected informations
  const handleresearch = () => {
    const selectedInfo = {
      lng: coordinates.lng,
      lat: coordinates.lat,
      schoolType: schoolType,
      schoolStatus: schoolStatus,
      distance: distance,
      adresse: address,
    };
    console.log("selectedInfo on geocoder", selectedInfo);
    props.onRetrieve(selectedInfo);
  };

  useEffect(() => {
    props.onCoordinatesChange(coordinates);
  }, [coordinates]);

  // console.log("address", address);
  // console.log("coordinates", coordinates);

  return (
    <div className="main-geocoder">
      <FormControl variant="outlined" sx={{ m: 1, minWidth: 240 }} size="small">
        <InputLabel id="school-type-label">Type d'écoles</InputLabel>
        <Select
          labelId="school-type-label"
          id="school-type"
          label="Type d'écoles"
          value={schoolType}
          onChange={handleSchoolTypeChange}
        >
          <MenuItem value="maternelle">Maternelle</MenuItem>
          <MenuItem value="élémentaire">Élémentaire</MenuItem>
          <MenuItem value="collège">Collège</MenuItem>
          <MenuItem value="lycée">Lycée</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="outlined" sx={{ m: 1, minWidth: 240 }} size="small">
        <InputLabel id="school-public-label">
          École publique ou privée
        </InputLabel>
        <Select
          labelId="school-public-label"
          id="school-public"
          label="École publique ou privée"
          value={schoolStatus}
          onChange={handleSchoolStatusChange}
        >
          <MenuItem value="Public">publique</MenuItem>
          <MenuItem value="Privée">privée</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="outlined" sx={{ m: 1, minWidth: 240 }} size="small">
        <InputLabel id="distance-label">Distance maximum (km)</InputLabel>
        <Select
          labelId="distance-label"
          id="distance"
          label="Distance maximum (km)"
          value={distance}
          onChange={handleDistanceChange}
        >
          <MenuItem value="1">1 km</MenuItem>
          <MenuItem value="5">5 km</MenuItem>
          <MenuItem value="10">10 km</MenuItem>
          <MenuItem value="20">20 km</MenuItem>
        </Select>
      </FormControl>
      <form>
        <SearchBox
          accessToken={accessToken}
          placeholder="adresse ou code postal"
          value={value}
          onChange={handleChange}
          onRetrieve={handleRetrieve}
        />
      </form>
      <Button
        variant="contained"
        sx={{ m: 1, minWidth: 240 }}
        size="small"
        onClick={handleresearch}
      >
        Rechercher
      </Button>
    </div>
  );
}

export default Geocoder;
