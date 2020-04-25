const express = require('express')
const data = require('./data') 
const routes = express.Router()

routes.get('/', (req, res) => {
   const recipes = [...data]

   return res.render('index', { recipes })
})

routes.get('/recipes/:index', (req, res) => {
   const recipes = [...data]
   const recipeIndex = req.params.index
   const recipe = recipes[recipeIndex]

   return res.render('recipes/show', { recipe })
})

module.exports = routes