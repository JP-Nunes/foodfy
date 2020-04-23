const express = require('express')
const routes = express.Router()

routes.get('/', (req, res) => {
   return res.render('index')
})

routes.get('/recipes/:index', (req, res) => {
   return res.render('recipes/show')
})

module.exports = routes