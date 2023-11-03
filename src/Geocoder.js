import React, { useState } from "react";
import { SearchBox } from "@mapbox/search-js-react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import "./Geocoder.css";

//TODO : revoir la doc mui material pour les select et les input afin de delete les warnings
function Geocoder(props) {
  const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
  const [value, setValue] = useState("");
  const [selectedInfo, setSelectedInfo] = useState({
    lng: 0,
    lat: 0,
    schoolType: "",
    schoolStatus: "",
    distance: "",
    adresse: "",
    city: "",
  });

  const handleChange = (e) => {
    setValue(e);
  };

  const handleInfoChange = (e) => {
    setSelectedInfo({
      ...selectedInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleRetrieve = (suggestions) => {
    if (suggestions) {
      // console.log(" suggestions true");
      //save the coordinates in the State selectedInfo
      setSelectedInfo({
        ...selectedInfo,
        lng: suggestions.features[0].geometry.coordinates[0],
        lat: suggestions.features[0].geometry.coordinates[1],
        adresse: suggestions.features[0].properties.full_address,
        city: suggestions.features[0].properties.context.place.name,
      });
    } else {
      alert("Veuillez entrer une adresse valide (adresse + ville)");
    }
  };

  const handleresearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/school/findSchool?lng=${selectedInfo.lng}&lat=${selectedInfo.lat}&schoolType=${selectedInfo.schoolType}&schoolStatus=${selectedInfo.schoolStatus}&distance=${selectedInfo.distance}&city=${selectedInfo.city}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("data school:", data);
        props.onRetrieve(selectedInfo);
      } else {
        console.error("Response not OK:", response.status);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="main-geocoder">
      <FormControl variant="outlined" sx={{ m: 1, minWidth: 240 }} size="small">
        <InputLabel id="school-type-label">Type d'écoles</InputLabel>
        <Select
          labelId="school-type-label"
          id="school-type"
          label="Type d'écoles"
          name="schoolType"
          onChange={handleInfoChange}
        >
          <MenuItem value="Maternelle">Maternelle</MenuItem>
          <MenuItem value="Elementaire">Elémentaire</MenuItem>
          <MenuItem value="Primaire">Primaire</MenuItem>
          <MenuItem value="College">Collège</MenuItem>
          <MenuItem value="Lycee">Lycée</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="outlined" sx={{ m: 1, minWidth: 240 }} size="small">
        <InputLabel id="school-public-label">École publique/privée</InputLabel>
        <Select
          labelId="school-public-label"
          id="school-public"
          label="École publique/privée"
          name="schoolStatus"
          onChange={handleInfoChange}
        >
          <MenuItem value="Public">publique</MenuItem>
          <MenuItem value="Privé">privée</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="outlined" sx={{ m: 1, minWidth: 240 }} size="small">
        <InputLabel id="distance-label">Distance maximum (km)</InputLabel>
        <Select
          labelId="distance-label"
          id="distance"
          label="Distance maximum (km)"
          name="distance"
          onChange={handleInfoChange}
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
          placeholder="adresse complète"
          value={value}
          onChange={handleChange}
          onRetrieve={handleRetrieve}
          options={{
            language: "fr",
            country: "FR",
          }}
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
