const express = require('express')
const routes = express.Router()

const home = require('./home')
const users = require('./users')
const recipes = require('./recipes')
const chefs = require('./chefs')

routes.use('/home', home)
routes.use('/admin/users', users)
routes.use('/admin/recipes', recipes)
routes.use('/admin/chefs', chefs)

module.exports = routes