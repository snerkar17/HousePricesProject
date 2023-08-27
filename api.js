import express from 'express'
import {getPrice} from './database.js'
import {getState} from './database.js'
import {getStatePrice} from './database.js'
import {getCities} from './database.js'
import {getPriceSpecific} from './database.js'
import cors from 'cors';
const app = express()
const corsOrigin = {
  origin: '*',
  credentials: true, // Allow credentials to be sent (such as cookies)
  optionSuccessStatus: 200 // Return a 200 status code for preflight requests
};

app.use(cors(corsOrigin)); // Use the cors middleware

//Get House Prices Time Series for a City
app.get("/price/:city", async (req, res) => {
  const city = req.params.city
  const price = await getPrice(city)
  res.send(price)
})
// more specifc
app.get("/price/:name/:state", async (req, res) => {
  const name = req.params.name
  const state = req.params.state
  const price = await getPriceSpecific(name, state)
  res.send(price)
})
// Get a List of All States
app.get("/state", async (req, res) => {
  const states = await getState()
  res.send(states)
})
// Get a House Prices Time Series for a State
app.get(`/api/house-prices/:state`, async (req, res) => {
  const state = req.params.state
  const price = await getStatePrice(state)
  res.send(price)
})
// Get a List of All Cities in Given State
app.get(`/api/getCity/:state`, async (req, res) => {
  const state = req.params.state
  const cities = await getCities(state)
  res.send(cities)
})
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})


app.listen(8080,() => {
  console.log('Server is running on port 8080')
})