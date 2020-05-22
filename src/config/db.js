const { Pool } = require('pg')

module.exports = new Pool ({
   user: 'postgres',
   password: 'imbackagain1',
   host: 'localhost',
   port: '5432',
   database: 'foodfy'
})