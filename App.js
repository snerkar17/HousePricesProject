
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import moment from 'moment';
const App = () => {
  // const baseURL = 'http://192.168.7.189:8080';
  const baseURL = 'http://10.192.54.48:8080';
  
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [housePrices, setHousePrices] = useState([]);

  // Function to fetch data from the /state API endpoint
  const fetchStates = async () => {
    try {
      const response = await axios.get(`${baseURL}/state`);
      return response.data;
    } catch (error) {
      console.error('Error fetching states:', error);
      throw error;
    }
  };

  // Function to fetch data from the /api/getCity/:state API endpoint
  const fetchCities = async (state) => {
    try {
      const response = await axios.get(`${baseURL}/api/getCity/${state}`);
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  // Function to fetch time series house prices for the selected city
  const fetchHousePrices = async (city, state) => {
    try {
      const response = await axios.get(`${baseURL}/price/${city}/${state}`);
      setHousePrices(response.data);
    } catch (error) {
      console.error('Error fetching house prices:', error);
    }
  };

  useEffect(() => {
    // Fetch the states when the component mounts
    fetchStates()
      .then((data) => setStates(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    setSelectedState(selectedState);

    if (selectedState) {
      fetchCities(selectedState);
    } else {
      // Clear the cities and house prices if no state is selected
      setCities([]);
      setHousePrices([]);
    }
  };

  const handleCityChange = (event) => {
    const selectedCity = event.target.value;
    setSelectedCity(selectedCity);

    if (selectedState && selectedCity) {
      fetchHousePrices(selectedCity, selectedState);
    } else {
      // Clear the house prices if no city is selected
      setHousePrices([]);
    }
  };

  return (
    <div style={{ backgroundColor: 'lightblue', height: '100vh' }}>
      <h2>House Prices by State!!</h2>
      <div>
        <label htmlFor="stateSelect">Select a state:</label>
        <select id="stateSelect" onChange={handleStateChange}>
          <option value="">Select a state</option>
          {states.map((state) => (
            <option key={state.State} value={state.State}>
              {state.State}
            </option>
          ))}
        </select>
      </div>

      {selectedState && (
        <div>
          <h3>Cities in {selectedState}</h3>
          <div>
            <label htmlFor="citySelect">Select a city:</label>
            <select id="citySelect" onChange={handleCityChange}>
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city.RegionName} value={city.RegionName}>
                  {city.RegionName}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

{selectedCity && housePrices.length > 0 && (
  <div>
    <h3>Time Series House Prices for {selectedCity}</h3>
   
    <LineChart width={1000} height={400} data={housePrices} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="CompleteDate"
        tickFormatter={(dateStr) => moment(dateStr).format('YYYY-MM-DD')}
      />
      <YAxis />
      <Tooltip
        labelFormatter={(label) => moment(label).format('YYYY-MM-DD')}
      />
      <Legend />
      <Line type="monotone" dataKey="price" stroke="#8884d8" />
    </LineChart>
  </div>
)}
    </div>
  );
};

export default App;
