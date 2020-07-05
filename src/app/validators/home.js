const RecipeLoader = require('../services/LoadRecipesService')
const Recipe = require('../models/Recipe')

module.exports = {
   async searchRecipes(req, res, next) {
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
   }
}