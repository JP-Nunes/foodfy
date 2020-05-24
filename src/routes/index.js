const Recipe = require('../app/models/Recipe')

const express = require('express')
const routes = express.Router()

const recipes = require('./recipes')
const chefs = require('./chefs')

routes.use('/recipes', recipes)
routes.use('/chefs', chefs)

routes.get('/', (req, res) => {
   Recipe.all(recipes => {

      return res.render('home/index', { recipes })
   })
})

module.exports = routes