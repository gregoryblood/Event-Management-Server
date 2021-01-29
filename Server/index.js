const express = require('express'); // Express web server framework
const pullTable = require('./pullTable.js'); //For db
var cookieParser = require('cookie-parser'); //For tokens
const path = require('path'); //For outh
var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET; // Your secret
var redirect_uri = 'https://localhost:3000/callback'; // Your redirect uri
const  PORT = process.env.PORT || 8888; ///Finds the port the server is being ran on
//Create Server
const app = express();

var cors = require('cors');

//Using an Express Server
app.use(express.json());
//Headers to dodge a bunch of errors
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:'+ PORT +'/');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
});
//Required to dodge a bunch of errors
app.use(cors());
//Gets All events and their data
app.get('/', (req, res) => {
    pullTable.getEvents()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
});
//Gets # of events
app.get('/count', (req, res) => {
  pullTable.numEvents()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
});
//Gets one event and its data
app.get('/:id', (req, res) => {
  const id = req.params.id;
  console.log("== req.params:", req.params);
  pullTable.getOneEvent(id)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
});
//Gets one event and its data
app.get('/add/:name+:description+:location+:edate+:etime', (req, res) => {
  const id = pullTable.numEvents();
  const name = req.params.name;
  const description = req.params.description;
  const location = req.params.location;
  const edate = req.params.edate;
  const etime = req.params.etime;

  console.log("== req.params:", req.params);
  pullTable.addOneEvent(id, name, description, location, edate, etime)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
});

//Function to console log that the server is running
app.listen(PORT, function () {
  console.log("== Server is listening on " + PORT);
});