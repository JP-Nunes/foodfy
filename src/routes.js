const express = require('express')
const data = require('./data') 
const routes = express.Router()

routes.get('/', (req, res) => {
   const recipes = [...data]
   const recipeIndex = req.params.index

   return res.render('index', { recipes, recipeIndex })
})

routes.get('/recipes/:index', (req, res) => {
   const recipes = [...data]
   const recipeIndex = req.params.index
   const recipe = recipes[recipeIndex]

   return res.render('recipes/show', { recipe })
})

module.exports = routes