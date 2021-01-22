const express = require('express'); // Express web server framework
const  PORT = process.env.PORT || 8888; ///Finds the port the server is being ran on
//Create Server
const app = express();
const pullTable = require('./pullTable.js');
var cors = require('cors');


app.use(express.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:'+PORT+'/');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
  });
app.use(cors());
app.get('/', (req, res) => {
    pullTable.getEvents()
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