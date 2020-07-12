const FileLoader = require('./LoadFilesService')

const Recipe = require('../models/Recipe')

module.exports = {
   async loadRecipe(recipeId) {
      try {
         const recipe = 
            await Recipe.findOneWithChefName(recipeId)
            
         const recipeFiles = 
            await FileLoader.loadRecipeFiles(recipe.id)
         
         return { 
            recipe, 
            recipeFiles 
         }   
      } catch (error) {
         console.error(error)
      }
   },
   async loadPaginatedRecipes(page, userId) {
      try {
         const currentPage = page || 1
         const limit = 6
         const offset = (currentPage - 1) * limit
   
         const recipes = await Recipe.paginate(
            { limit, offset },
            userId
         )
         
         if(recipes.length > 0) {
            let total = Math.ceil(recipes[0].total / limit)
            
            if(currentPage == 1 
               && recipes.length < limit 
               || recipes.length == recipes[0].total
               ) {
               total = 1
            }

            const pagination = {
               page: currentPage,
               total
            }
            
            const recipesWithFiles = 
               await FileLoader.loadRecipesFiles(recipes)
            
            return { recipes: recipesWithFiles, pagination }
         }
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
         const chefRecipes = await Recipe.findAll({
            where: { chef_id: chefId }
         })
         
         const chefRecipesWithFiles = 
            await FileLoader.loadRecipesFiles(chefRecipes)

         return chefRecipesWithFiles   
      } catch (error) {
         console.error(error)
      }
   }
}