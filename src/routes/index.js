const HomeController = require('../app/controllers/HomeController')

const express = require('express')
const routes = express.Router()

const recipes = require('./recipes')
const chefs = require('./chefs')

routes.use('/admin/recipes', recipes)
routes.use('/admin/chefs', chefs)

routes.get('/home', HomeController.index)
routes.get('/recipes', HomeController.recipes)
routes.get('/chefs', HomeController.chefs)
routes.get('/search', HomeController.searchRecipes)

module.exports = routes