const LoadFilesService = require('./LoadFilesService')

const Recipe = require('../models/Recipe')

module.exports = {
   async loadRecipe(filter) {
      const recipe = await Recipe.findOne(filter)
      const recipeFiles = await LoadFilesService.loadRecipeFiles(recipe.id)

      return { recipe, recipeFiles }
   },
   async loadPaginatedRecipes(page) {
      const currentPage = page || 1
      const limit = 6
      const offset = (currentPage - 1) * limit

      const recipes = await Recipe.paginate({ limit, offset })
      const recipesWithFiles = await LoadFilesService.loadRecipesFiles(recipes)

      const pagination = {
         page: currentPage,
         total: Math.ceil(recipes[0].total / limit)   
      }      
      
      return { recipes: recipesWithFiles, pagination }
   }
}