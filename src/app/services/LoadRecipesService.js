const FileLoader = require('./LoadFilesService')

const Recipe = require('../models/Recipe')

module.exports = {
   async loadRecipe(filter) {
      try {
         const recipe = await Recipe.findOne(filter)
         const recipeFiles = 
            await FileLoader.loadRecipeFiles(recipe.id)
   
         return { recipe, recipeFiles }   
      } catch (error) {
         console.error(error)
      }
   },
   async loadPaginatedRecipes(page) {
      try {
         const currentPage = page || 1
         const limit = 6
         const offset = (currentPage - 1) * limit
   
         const recipes = await Recipe.paginate({ limit, offset })
         
         const recipesWithFiles = 
            await FileLoader.loadRecipesFiles(recipes)
   
         const pagination = {
            page: currentPage,
            total: Math.ceil(recipes[0].total / limit)   
         }      
         
         return { recipes: recipesWithFiles, pagination }   
      } catch (error) {
         console.error(error)
      }
   },
   async loadFilteredRecipes(filter) {
      const recipes = await Recipe.filtered(filter)

      const recipesWithFiles = 
         await FileLoader.loadRecipesFiles(recipes)
      
      return recipesWithFiles
   },
   async loadChefRecipes(chefId) {
      try {
         const chefRecipes = await Recipe.findChefRecipes(chefId)

         const chefRecipesWithFiles = 
            await FileLoader.loadRecipesFiles(chefRecipes)

         return chefRecipesWithFiles   
      } catch (error) {
         console.error(error)
      }
   }
}