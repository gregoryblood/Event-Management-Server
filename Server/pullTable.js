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
    pool.query('SELECT * FROM events', (error, results) => {
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
//Returns # of events
const numEvents = (name, description, location, edate, etime) => {
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
      'UPDATE events SET maxSlots = ' + num + ' WHERE id=' + id, (error, results
      ) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}
//Add person to event
const addAttendee = (id) => {
  return new Promise(function (resolve, reject) {
    pool.query(
      'UPDATE events SET slots = slots + 1 WHERE id=' + id, (error, results
      ) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}
const removeAttendee = (id) => {
  return new Promise(function (resolve, reject) {
    pool.query(
      'UPDATE events SET slots = slots - 1 WHERE id=' + id, (error, results
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
//[THIS IS BROKEN BECUASE I EXPECT CHANGE LATER]
const addOneEvent = (id, name, description, location, edate, etime) => {
  return new Promise(function (resolve, reject) {
    pool.query(
      'INSERT INTO events(id, name, description, location, edate, etime) VALUES ( \'' + id + '\', \'' + name + '\', \'' + description + '\',\'' + location + '\',\'' + edate + '\',\'' + etime + '\',', (error, results
      ) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

module.exports = {
  getEvents,
  getEventsByTime,
  numEvents,
  getOneEvent,
  addOneEvent,
  addAttendee,
  removeAttendee,
  updateMaxSlots,
}