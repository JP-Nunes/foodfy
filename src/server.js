const express = require('express')
const routes = require('./routes')
const nunjucks = require('nunjucks')

const server = express()

server.set('view engine', 'njk')

server.use(express.static('public'))
server.use(express.static('src/assets'))
server.use(routes)

nunjucks.configure('src/app/views', {
   express: server
})

server.listen(5000, () => console.log('server is running'))