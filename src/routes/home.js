const express = require('express')
const routes = express.Router()

const HomeController = require('../app/controllers/HomeController')

routes.get('/index', HomeController.index)
routes.get('/recipes', HomeController.recipes)
routes.get('/chefs', HomeController.chefs)
routes.get('/search', HomeController.searchRecipes)

module.exports = routes