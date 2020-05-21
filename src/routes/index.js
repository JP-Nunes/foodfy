const express = require('express')
const data = require('./data')
const routes = express.Router()

const recipes = require('./recipes')
const chefs = require('./chefs')

routes.use('/recipes', recipes)
routes.use('/chefs', chefs)

routes.get('/', (req, res) => {
   const recipes = [...data]

   return res.render('home/index', { recipes })
})

module.exports = routes