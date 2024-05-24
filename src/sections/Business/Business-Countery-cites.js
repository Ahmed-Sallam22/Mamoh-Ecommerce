/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RHFSelect } from 'src/components/hook-form';

export const CounteryCitesBusines = ({ onCountryChange, onCityChange ,setselected }) => {
    const [counteries, setCounteries] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
  
    useEffect(() => {
      // Fetch the list of countries
      const fetchCountries = async () => {
        try {
          const response = await axios.get('https://tapis.ma-moh.com/api/countries', {
         
          });
  
          setCounteries(response.data.data);
        } catch (error) {
          console.error('Error fetching countries:', error);
        }
      };
  
      fetchCountries();
    }, []);
  
    const handleCountryChange = async (e) => {
      const countryId = parseInt(e.target.value, 10);
      setSelectedCountry(countryId);
      
      // Fetch the list of cities based on the selected country
      try {
        const response = await axios.get(`https://tapis.ma-moh.com/api/cities?&country_id=${countryId}`, {
       
        });
  
        setCities(response.data.data);
  
        // Invoke the callback for country change in the parent component
        if (onCountryChange) {
          onCountryChange(countryId);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
  
    const handleCityChange = (e) => {
      const cityId = parseInt(e.target.value, 10);
      setSelectedCity(cityId);
  
      // Invoke the callback for city change in the parent component
      if (onCityChange) {
        onCityChange(cityId);
      }
    };
  const renderProperties = (
    <>
      <RHFSelect
        native
        name="country"
        label="Country"
        value={selectedCountry}
        InputLabelProps={{ shrink: true }}
        onChange={handleCountryChange}
      >
          <option value="" disabled selected>Please select Your Country</option> {/* Default option */}

        {counteries.map((country) => (
          <option key={country.id} value={country.id}>
            {country.name}
           
          </option>
          
        ))}
      </RHFSelect>
      {cities.length > 0 ? (
  <RHFSelect
    native
    name="city"
    label="City"
    value={selectedCity}
    onChange={handleCityChange}
    InputLabelProps={{ shrink: true }}
  >
              <option value="" disabled selected>Please select Your City</option> {/* Default option */}

    {cities.map((city) => (
      <option key={city.id} value={city.id}>
        {city.name}
      </option>
    ))}
  </RHFSelect>
) : (
  <RHFSelect
    native
    name="city"
    label="City"
    value="" // Set value to an empty string when there's no data
    InputLabelProps={{ shrink: true }}
    disabled // Disable the select when there's no data
  >
    <option>No data</option>
  </RHFSelect>
)}
    </>
  );

  return <>{renderProperties}</>;
};
