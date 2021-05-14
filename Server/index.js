//require('dotenv').config();
const express = require('express'); // Express web server framework
const pullTable = require('./pullTable.js'); //For db
var request = require('request');
var cors = require('cors'); //Cors headers
var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET; // Your secret
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
  pullTable.getEventsByTime(req.params.start, req.params.end)
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
app.get('/addattendee/:id/:email/:name', (req, res) => {
  const id = req.params.id;
  //const array = req.body.array;
  const email = req.params.email;
  const name = req.params.name;
  pullTable.addAttendee(id, email, name)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })

}); 
//Signs up for Event
app.get('/removeattendee/:id/:email/:name', (req, res) => {

  const id = req.params.id;
  //const array = req.body.array;
  const email = req.params.email;
  const name = req.params.name;
  pullTable.removeAttendee(id, email, name)
    .then(response => {
      //console.log(response);
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
});
//Signs up for Event  
app.get('/getattendee/:id/', (req, res) => {
  const id = req.params.id;
  pullTable.getAttendee(id)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    }) 
});  
//Get's events based on email
app.get('/getmyevents/:email', (req, res) => {
  const email = req.params.email;
  pullTable.getMyEvents(email)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
}); 
//Adds One event
app.post('/add', (req, res) => {
  //Could just send the object and deal with it in the function call
  const id = req.body.id;
  const name = req.body.name;
  const description = req.body.description;
  const location = req.body.location;
  const edate = req.body.edate;
  const etime = req.body.etime;
  const slots = req.body.slots;
  const maxslots = req.body.maxslots;
  const author = req.body.author;
  pullTable.addOneEvent( id, name, description, location, edate, etime, slots, maxslots, author)
    .then(response => {
      res.status(200).send(response);
    })  
    .catch(error => {
      res.status(500).send(error);
    })
});
//Edits One event   
app.put('/edit', (req, res) => {
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
      res.status(204).send(response);
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


var bearerToken = '';
 
//Gets an initial token
app.post('/login/', (req, res) => {
  //Create headers
  var headers = {
    'accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  //My unsecure Strings
  var dataString = 'client_id='+client_id+'&client_secret='+client_secret+'&grant_type=client_credentials';
  //Options before sending for api
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
      Next(req, res, bearerToken);
    }
  }
  request(options, callback);
});
//After token get status of the student
function Next (req, res, token) {
  var email = req.body.email;
  encodeURIComponent(email)
  var headers = {
    'accept': 'application/json',
    'authorization': ("Bearer "+token+"")
  };
  var options = {
    url: 'https://api.oregonstate.edu/v2/directory?page%5Bnumber%5D=1&page%5Bsize%5D=1&filter%5BemailAddress%5D='+email,
    headers: headers
  }; 

  function callback(error, response, body) {
    if (!error) {
        const obj = JSON.parse(body);
        res.status(200).send(obj);
    }
    else {
      console.error('Error: ' + response.statusCode+'\n'+body)
    }
  }

  request(options, callback);
}



//Function to console log that the server is running
app.listen(PORT, function () {
  console.log("== Server is listening on " + PORT);
});