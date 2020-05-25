const Controller = require('../app/controllers/Controller')

const express = require('express')
const routes = express.Router()

const recipes = require('./recipes')
const chefs = require('./chefs')

routes.use('/admin/recipes', recipes)
routes.use('/admin/chefs', chefs)

routes.get('/home', Controller.index)
routes.get('/recipes', Controller.recipes)
routes.get('/chefs', Controller.chefs)

module.exports = routes