require('dotenv').config();
const express = require('express'); // Express web server framework
const pullTable = require('./pullTable.js'); //For db
var request = require('request');
var cookieParser = require('cookie-parser'); //For tokens
var cors = require('cors'); //Cors headers
const path = require('path'); //For outh
var querystring = require('querystring'); //Tool for api querys
var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET; // Your secret
var redirect_uri = 'https://osu-event-server.herokuapp.com/callback'; // Your redirect uri
const PORT = process.env.PORT || 8888; ///Finds the port the server is being ran on
//Create Server
const app = express();




//Using an Express Server
app.use(express.json());
//Headers to dodge a bunch of errors
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:' + PORT + '/');
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
//Gets All events with slots more than 0 [WILL REMOVE LATER]
app.get('/getwithslots/', (req, res) => {
  pullTable.getEventsWithSlots()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
});
//Searches
app.get('/search/:keyword', (req, res) => {
  const keyword = req.params.keyword
  pullTable.searchEvents(keyword)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
});
//Get event by startTime and endTime
app.get('/getByTime/:start/:end', (req, res) => {
  console.log("== req.params:", req.params);
  pullTable.getEventsByTime(req.params.start,req.params.end)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
}); 
//Get event by startTime and endTime
app.get('/getByDay/:day', (req, res) => {
  console.log("== req.params:", req.params);
  pullTable.getEventsByDay(req.params.day)
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
app.get('/get/:id', (req, res) => {
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
//Updates max slots for event
app.get('/updatemaxslots/:id/:num', (req, res) => {
  const id = req.params.id;
  const num = req.params.num;
  console.log("== req.params:", req.params);
  pullTable.updateMaxSlots(id, num)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
}); 
//Signs up for Event
app.get('/addattendee/:id/', (req, res) => {
  const id = req.params.id;
  pullTable.addAttendee(id)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
});
//Signs up for Event
app.get('/removeattendee/:id/', (req, res) => {
  const id = req.params.id;
  pullTable.removeAttendee(id)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
});
//Adds One event
app.post('/add', (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const description = req.body.description;
  const location = req.body.location;
  const edate = req.body.edate;
  const etime = req.body.etime;
  const slots = req.body.slots;
  const maxslots = req.body.maxslots;
  pullTable.addOneEvent( id, name, description, location, edate, etime, slots, maxslots)
    .then(response => {
      res.status(200).send(response);
    })  
    .catch(error => {
      res.status(500).send(error);
    })
});
//Edits One event
app.post('/edit', (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const description = req.body.description;
  const location = req.body.location;
  const edate = req.body.edate;
  const etime = req.body.etime;
  const slots = req.body.slots;
  const maxslots = req.body.maxslots;
  pullTable.editEvent(id, name, description, location, edate, etime, slots, maxslots)
    .then(response => {
      res.status(200).send(response);
    })  
    .catch(error => {
      res.status(500).send(error);
    })
});

//Removes an Event
app.get('/remove/:id', (req, res) => {
  const id = req.params.id;
  pullTable.removeOneEvent(id)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
})

//-----------------------
// AUTHENTIFICATION STUFF
//-----------------------
//This will for updating our state

var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var bearerToken = '';

//Handling Logging in
app.get('/login', function (req, res) {


  var headers = {
    'accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  var dataString = 'client_id=CXgJb9qKGN6EtcsVQasPGh24ZB9MI4U4&client_secret=oq2XYLl1Obv5z7ZQ&grant_type=client_credentials';
  var options = {
    url: 'https://api.oregonstate.edu/oauth2/token',
    method: 'POST',
    headers: headers, 
    body: dataString
  };
  //Called once request happens
  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      //console.log(body);
      const obj = JSON.parse(body);
      bearerToken = obj.access_token;
      //console.log(bearerToken);
      Next(res, bearerToken);
    }
  }
  request(options, callback);
});
function Next (res, token) {

  var headers = {
    'accept': 'application/json',
    'authorization': ("Bearer "+token+"")
  };
  var options = {
    url: 'https://api.oregonstate.edu/v2/directory?page%5Bnumber%5D=1&page%5Bsize%5D=1&filter%5BemailAddress%5D=bloodg%40oregonstate.edu',
    headers: headers
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        //console.log(body);
        const obj = JSON.parse(body);
        //console.log(obj.data[0].attributes.primaryAffiliation);
        res.status(200).send(obj.data[0].attributes.primaryAffiliation);
        //res.redirect('http://localhost:8888/');
    }
    else {
      console.error('Error: ' + response.statusCode+'\n'+body)
      res.redirect('http://localhost:8888/');
    }
  }

  request(options, callback);
}
//Gets the info of the user based on email
app.get('/getinfo', function (req, res) {
  var storedState = req.cookies ? req.cookies['BearerToken'] : null;

  var headers = {
    'accept': 'application/json',
    'authorization': 'BearerToken ' + storedState
  };

  var options = {
    url: 'https://api.oregonstate.edu/v2/directory?page%5Bnumber%5D=1&page%5Bsize%5D=1&filter%5BemailAddress%5D=bloodg%40oregonstate.edu',
    headers: headers
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
    else {
      console.error('Error: '+response.statusCode)
    }
  }

  request(options, callback);
});

//This is used for when our api goes through
app.get('/callback', function (req, res) {
    // your application requests refresh and access tokens
  // after checking the state parameter
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://api.oregonstate.edu/oauth2/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.oregonstate.edu/v2/directory?page%5Bnumber%5D=1&page%5Bsize%5D=1&filter%5Bonid%5D=bloodg',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function (error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          `https://osu-event-server.herokuapp.com/${querystring.stringify({
            access_token,
            refresh_token,
          })}`,
        );
      } else {
        res.redirect('/' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});



//Function to console log that the server is running
app.listen(PORT, function () {
  console.log("== Server is listening on " + PORT);
});