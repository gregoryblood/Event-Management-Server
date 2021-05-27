const Pool = require('pg').Pool;

//All of our DataBase Information
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
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
    pool.query('SELECT DISTINCT * FROM events WHERE UPPER(name) LIKE \'%' + keyword + '%\' OR UPPER(description) LIKE \'%' + keyword + '%\' ORDER BY edate ASC',
    (error, results) => {
      if (error || typeof results === 'undefined') {
        reject(error)
        return;
      }else {
        resolve(results.rows);
      }
    })
  })
}
//Get event by startTime and endTime 
const getEventsByTime = (start, end) => {
  return new Promise(function (resolve, reject) {
    pool.query("SELECT * FROM events WHERE edate BETWEEN '" + start + "' AND '" + end + "' ORDER BY edate ASC", (error, results) => {
      if (error || typeof results === 'undefined') {
        reject(error)
      }else 
      resolve(results.rows);
    })
  })
}
//Get event by day
const getEventsByDay = (day) => {
  return new Promise(function (resolve, reject) {
    pool.query("SELECT * FROM events WHERE edate = '" + day + "' ORDER BY edate ASC", (error, results) => {
      if (error || typeof results === 'undefined') {
        reject(error)
      }else
      //console.log(results)
      resolve(results.rows);
    })
  })
}
//Returns # of events
const numEvents = () => {
  return new Promise(function (resolve, reject) {
    pool.query(
      'SELECT COUNT(*) FROM events',
      (error, results) => {
      if (error || typeof results === 'undefined') {
        reject(error)
      }else
      resolve(results.rows);
    })
  })
}
//Updates Max Slots
const updateMaxSlots = (id, num) => {
  return new Promise(function (resolve, reject) {
    pool.query(
      'UPDATE events SET maxSlots = ' + num + ' WHERE id=\'' + id + "\';",
      (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}
//Add person to event
const addAttendee = (id, email, name) => {
  return new Promise(function (resolve, reject) {
    pool.query(
      'UPDATE events SET slots = slots + 1 WHERE id=\'' + id + "\';" +
      "INSERT INTO even (eventsID,email,name) VALUES ('" + id + "','" + email + "','" + name + "');",
      (error, results) => {
        if (error) {
          console.log(error);
          reject(error)
        } //console.log(results);
        resolve(results);
      })
  })

}
const removeAttendee = (id, email, name) => {
  return new Promise(function (resolve, reject) {
    console.log(id);
    console.log(email);
    pool.query(
      'UPDATE events SET slots = slots - 1 WHERE id=\'' + id + "\';" +
      "DELETE FROM even WHERE eventsID ='" + id + "' and email ='" + email + "' and name='" + name + "';",
      (error, results) => {
        if (error) {
          console.log(error);
          reject(error)
        }
        resolve(results);
      })
  })
}
//Gets attendees of event
const getAttendee = (id) => {
  return new Promise(function (resolve, reject) {
        pool.query(
          "SELECT * FROM even WHERE eventsID ='" + id + "'"
          , (error, results
          ) => {
            if (error) {
              console.log(error);
              reject(error)
            }
            //console.log(results.rows);
            resolve(results.rows);
          })

        })
}
//Gets user's events
const getMyEvents = (email) => {
  return new Promise(function (resolve, reject) {
    pool.query(
      "SELECT * FROM even WHERE email ='" + email + "'", (error, results ) => {
        if (error) {
          console.log(error);
          reject(error)
        }
        //console.log(results.rows);
        resolve(results.rows);
      })
    })
}
//Gets user's events
const getMyOwnedEvents = (email) => {
  return new Promise(function (resolve, reject) {
    pool.query(
      "SELECT * FROM events WHERE author ='" + email + "'", (error, results ) => {
        if (error) {
          console.log(error);
          reject(error)
        }
        //console.log(results.rows);
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
      "INSERT INTO events (id, name, description, location, edate, etime,slots,maxslots,author)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9);",
      [id, name, description, location, edate, etime, slots, maxslots, author],
      (error, results) => {
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
      'UPDATE events SET id=$1, name=$2, description=$3, location=$4, edate=$5, etime=$6,slots=$7,maxslots=$8 WHERE id = $9;', 
      [id, name, description, location, edate, etime, slots, maxslots, id],
      (error, results) => {
        if (error) {
          reject(error)
        }
        //console.log("results:",results)
        resolve("success");
    });
  })
}
//Removes an event
const removeOneEvent = (id) => {
  return new Promise(function (resolve, reject) {
    pool.query(
      'DELETE FROM events WHERE id = \'' + id + "\';", 
      (error, results) => {
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
  getAttendee,
  getMyEvents,
  updateMaxSlots,
  searchEvents,
  getEventsByDay,
  editEvent,
  getMyOwnedEvents
}