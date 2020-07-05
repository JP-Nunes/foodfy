const FileLoader = require('./LoadFilesService')

const Chef = require('../models/Chef')

module.exports = {
   async loadChef(filter) {
      try {
         const chef = await Chef.findOne(filter)

         const chefImage = 
            await FileLoader.loadChefFile(chef.file_id)
      
         return { chef, chefImage }
      } catch (error) {
         console.error(error)
      }
   },
   async loadChefs() {
      try {
         const chefs = await Chef.findAllAndCountRecipes() 

         const chefsWithFiles = 
         await FileLoader.loadChefsFiles(chefs)
      
         return chefsWithFiles
      } catch (error) {
         console.error(error)
      }
   }
}