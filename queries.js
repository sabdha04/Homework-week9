const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'movies',
    password: 'sabdha04',
    port: '5432',
})

module.exports = pool;