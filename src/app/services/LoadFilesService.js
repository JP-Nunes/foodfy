const File = require('../models/File')

module.exports = {
   async loadRecipeFiles(recipeId) {
      let recipeFiles = await File.allRecipeFiles(recipeId)
         recipeFiles = recipeFiles.map(file => ({
         ...file,
         src: `${file.path.replace('public', '')}`
      }))

      return recipeFiles
   },
   async loadRecipesFiles(recipes) {
      const recipesWithFilePromise = recipes.map(async recipe => {
         const files = await File.allRecipeFiles(recipe.id)
         const firstFile = files[0]
   
         return recipe = {
            ...recipe,
            image_src: `${firstFile.path.replace('public', '')}`
         }
      })
      const recipesWithFiles = await Promise.all(recipesWithFilePromise)
   
      return recipesWithFiles
   }
}