const express = require('express')
const routes = express.Router()

const Validator = require('../app/validators/home')

const HomeController = require('../app/controllers/HomeController')

routes.get('/index', HomeController.index)
routes.get('/recipes', Validator.recipes, HomeController.recipes)
routes.get('/chefs', HomeController.chefs)
routes.get('/search', Validator.searchRecipes, HomeController.searchRecipes)

module.exports = routes