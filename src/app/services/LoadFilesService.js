const File = require('../models/File')

module.exports = {
   async loadRecipeFiles(recipeId) {
      try {
         let recipeFiles = await File.allRecipeFiles(recipeId)
            recipeFiles = recipeFiles.map(file => ({
            ...file,
            src: `${file.path.replace('public', '')}`
         }))

         return recipeFiles
      } catch (error) {
         console.error(error)
      }
      
   },
   async loadRecipesFiles(recipes) {
      try {
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
      } catch (error) {
         console.error
      }
   },
   async loadChefFile(chefFileId) {
      try {
         let chefImage = await File.findOne({
            where: { id: chefFileId }
         })
         chefImage = {
            ...chefImage,
            src: `${chefImage.path.replace('public', '')}`
         }
   
         chefImage.src = chefImage.src.replace(/\\/g, '/')
   
         return chefImage
      } catch (error) {
         console.error(error)
      }
      
   },
   async loadChefsFiles(chefs) {
      try {
         const chefsWithFilesPromise = chefs.map(async chef => {
            const file = await File.findOne({
               where: { id: chef.file_id }
            })
   
            return chef = {
               ...chef,
               image_src: `${file.path.replace('public', '')}`
            }
         })
         const chefsWithFiles = await Promise.all(chefsWithFilesPromise)
   
         return chefsWithFiles
      } catch (error) {
         console.error(error)
      }
   }
}