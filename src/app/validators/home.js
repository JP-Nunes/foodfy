const RecipeLoader = require('../services/LoadRecipesService')
const Recipe = require('../models/Recipe')

module.exports = {
   async searchRecipes(req, res, next) {
      const recipes = await Recipe.findAll()
      
      if(recipes.length === 0) {
         return res.render('home/search')
      }

      const { filter } = req.query

      if(!filter) {
         const { recipes, pagination } = 
            await RecipeLoader.loadPaginatedRecipes()

         return res.render('home/search', { 
            recipes, 
            pagination 
         })
      }

      req.filter = filter

      next()
   },
   async recipes(req, res, next) {
      const recipes = await Recipe.findAll()
      
      if(recipes.length === 0) {
         return res.render('home/recipes')
      }

      next()
   }
}