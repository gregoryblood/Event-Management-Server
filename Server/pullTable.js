const Pool = require('pg').Pool;

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


const getEvents = () => {
    return new Promise(function(resolve, reject) {
      pool.query('SELECT * FROM events', (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
}

module.exports = {
    getEvents,

  }