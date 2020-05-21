const express = require('express')
const methodOverride = require('method-override')
const nunjucks = require('nunjucks')

const routes = require('./routes')

const server = express()

server.set('view engine', 'njk')

server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'))
server.use(express.static('src/assets'))
server.use(methodOverride('_method'))
server.use(routes)

nunjucks.configure('src/app/views', {
   express: server
})

server.listen(5000, () => console.log('server is running'))