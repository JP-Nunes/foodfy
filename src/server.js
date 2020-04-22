const express = require('express')
const routes = require('./routes')
const nunjucks = require('nunjucks')

const server = express()

server.set('view engine', 'html')
server.use(routes)

nunjucks.configure('src/app/views', {
   express: server
})

server.listen(5000, () => console.log('server is running'))