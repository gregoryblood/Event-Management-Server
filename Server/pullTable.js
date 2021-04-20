const Pool = require('pg').Pool;

//All of our DataBase Information
const pool = new Pool({
  user: 'lixwdkowanwcbl',
  host: 'ec2-52-0-155-79.compute-1.amazonaws.com',
  database: 'd2sq78a7vcmk9k',
  password: '0af2457741359d8e3586b3e824d15050c0cfcc38fb9951979f1bf500d7aa37db',
  port: 5432,
  "dialect": "postgres",
  "operatorsAliases": false,
  ssl: {
    rejectUnauthorized: false
  }
});

//Returns every event made
const getEvents = () => {
  return new Promise(function (resolve, reject) {
    pool.query('SELECT * FROM events ORDER BY edate ASC', (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}
const getEventsWithSlots = () => {
  return new Promise(function (resolve, reject) {
    pool.query('SELECT * FROM events WHERE slots > 0 ORDER BY edate ASC', (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}
//Get event by startTime and endTime
const searchEvents = (keyword) => {
  return new Promise(function (resolve, reject) {
    pool.query('SELECT * FROM events WHERE name LIKE \'% ' + keyword + '%\' OR description LIKE \'%' + keyword + '%\' ORDER BY edate ASC', (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}
//Get event by startTime and endTime
const getEventsByTime = (start, end) => {
  return new Promise(function (resolve, reject) {
    pool.query("SELECT * FROM events WHERE edate BETWEEN '"+start+"' AND '"+end+"'", (error, results) => {
      if (error) {
        reject(error)
      }
      console.log(results)
      resolve(results.rows);
    })
  })
}
//Get event by day
const getEventsByDay = (day) => {
  return new Promise(function (resolve, reject) {
    pool.query("SELECT * FROM events WHERE edate = '"+day+"' ORDER BY edate ASC", (error, results) => {
      if (error) {
        reject(error)
      }
      console.log(results)
      resolve(results.rows);
    })
  })
}
//Returns # of events
const numEvents = ( ) => {
  return new Promise(function (resolve, reject) {
    pool.query(
      'SELECT COUNT(*) FROM events', (error, results
      ) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}
//Updates Max Slots
const updateMaxSlots = (id, num) => {
  return new Promise(function (resolve, reject) {
    pool.query(
      'UPDATE events SET maxSlots = ' + num + ' WHERE id=\'' + id + "\';", (error, results
      ) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}
//Add person to event
const addAttendee = (id,array) => {
  console.log(array)
  return new Promise(function (resolve, reject) {
    pool.query(
      "UPDATE events SET author = '"+array+"' WHERE id=\'" + id + "\';", (error, results
      ) => {
      if (error) {
        reject(error)
      }
      resolve(results);
    })
  })
}
const removeAttendee = (id) => {
  return new Promise(function (resolve, reject) {
    pool.query(
      'UPDATE events SET slots = slots - 1 WHERE id=\'' + id + "\';", (error, results
      ) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}
//Returns every event made
const getOneEvent = (id) => {
  return new Promise(function (resolve, reject) {
    pool.query('SELECT * FROM events Where id = ' + id, (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}
//Adds One Event  
const addOneEvent = (id, name, description, location, edate, etime, slots, maxslots, author) => {
  return new Promise(function (resolve, reject) {
    pool.query(
      "INSERT INTO events (id, name, description, location, edate, etime,slots,maxslots,author)VALUES('"+id+"','"+name+"','"+description+"','"+location+"','"+edate+"','"+etime+"','"+slots+"','"+maxslots+"','"+author+"');", (error, results
        ) => {
      if (error) {
        reject(error)
      }
      //console.log("results:",results,error)
      resolve("success");
    })
  })
}  
//Edit One Event  
const editEvent = (id, name, description, location, edate, etime, slots, maxslots) => {
  return new Promise(function (resolve, reject) {
    pool.query(
      "UPDATE events SET id='"+id+"', name='"+name+"', description='"+description+"', location='"+location+"', edate='"+edate+"', etime='"+etime+"',slots='"+slots+"',maxslots='"+maxslots+"' WHERE id = '"+id+"';", (error, results
        ) => {
      if (error) {
        reject(error)
      }
      //console.log("results:",results,error)
      resolve("success");
    })
  })     
}     
//Removes an event
const removeOneEvent = (id) => {
  return new Promise(function (resolve, reject) {
    pool.query(
      'DELETE FROM events WHERE id = \'' + id + "\';", (error, results
      ) => {
      if (error) {
        reject(error)
      }
      //console.log("results:",results,error)
      resolve("success");
    })
  })        
}

module.exports = {
  getEvents,
  getEventsWithSlots,
  getEventsByTime,
  numEvents,
  getOneEvent,
  addOneEvent,
  removeOneEvent,
  addAttendee,
  removeAttendee,
  updateMaxSlots,
  searchEvents,
  getEventsByDay,
  editEvent,
}