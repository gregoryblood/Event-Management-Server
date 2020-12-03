const bodyParser = require('body-parser'); //Json reader
const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const cors = require('cors'); //Fixes Core Errors
const path = require('path'); //Helps find files and stuff
const  PORT = process.env.PORT || 8888; ///Finds the port the server is being ran on

//Postgres Things - https://devcenter.heroku.com/articles/getting-started-with-nodejs#provision-a-database
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
//Rout to DB
app.get('/db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM test_table');
    const results = { 'results': (result) ? result.rows : null};
    res.render('pages/db', results );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

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
  
  if (req.body && req.body.name && req.body.description && req.body.location) {
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