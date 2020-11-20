const bodyParser = require('body-parser'); //Json reader
const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const cors = require('cors'); //Fixes Core Errors
const path = require('path'); //Helps find files and stuff
const  PORT = process.env.PORT || 8888; ///Finds the port the server is being ran on
//Create Server
const app = express();
//Tell our app to use tools
app
  .use(bodyParser.json())
  .use(cors());
//This is just for testing (it gets a local file)
const eventData = require('./events.json');

app.get('/', function (req, res, next) {
    console.log("== Got a request");
    res.status(200).send("Hello world!");
});

app.get('/events', function (req, res, next) {
    console.log("== Got a events request");
    res.status(200).send({
      events: eventData
    });
});

//Create new event
app.post('/events', function (req, res, next) {
  console.log(req.body);
  if (req.body && req.body.name && req.body.description
        && req.body.location) {
    eventData.push(req.body);
    res.status(201).send({
      id: eventData.length - 1
    });
  } else {
    res.status(400).send({
      err: "Request doesn't have required fields"
    })
  }
});
//Get specific event
app.get('/lodgings/:id', function (req, res, next) {
  console.log("== req.params:", req.params);
  const id = req.params.id;
  if (eventData[id]) {
    res.status(200).send(eventData[id]);
  } else {
    next();
  }
});

//I think it's called anytime an external middle ware funciton is called
//I dont know what this does exactly
app.use(function (req, res, next) {
    console.log("== Inside this middle middleware function");
    next();
});

//Catch all function
app.use('*', function (req, res, next) {
res.status(404).send({
    err: `${req.originalUrl} doesn't exist`
    });
});

//Function to console log that the server is running
app.listen(PORT, function () {
  console.log("== Server is listening on " + PORT);
});