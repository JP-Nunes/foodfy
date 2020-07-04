const Recipe = require("../models/Recipe")
const Chef = require("../models/Chef")
const File = require("../models/File")
const { edit } = require("../controllers/RecipeController")

module.exports = {
   async show(req, res, next) {
      try {
         const recipe = await Recipe.findOne({
            where: { id: req.params.id }
         })

         if(!recipe) {
            return res.render('recipes/index', {
               error: 'Receita não encontrada',
            })
         }
         
         req.recipe = recipe

         next()   
      } catch (error) {
         console.error(error)
      }
   },
   async post(req, res, next) {
      try {
         const chefsNameAndId = await Chef.nameAndId()
         const keys = Object.keys(req.body)

         for(key of keys) {
            if(req.body[key] == 'null') {
               return res.render('recipes/create', {
                  error: 'Todos os campos são necessários',
                  recipe: req.body,
                  chefsNameAndId
               })
            }
         }

         if(req.files.length < 1) {
            return res.render('recipes/create', {
               error: 'É necessário ao menos uma imagem',
               recipe: req.body,
               chefsNameAndId
            })
         }

         next()
      } catch (error) {
         console.error(error)
      }
      
   },
   async put(req, res, next) {
      try {
         const { id } = req.body
         let { removed_files } = req.body
         const chefsNameAndId = await Chef.nameAndId()
         
         const keys = Object.keys(req.body)
   
         for(key of keys) {
            if(req.body[key] == 'null') {
               return res.render(`recipes/edit`, {
                  error: 'Todos os campos são necessários',
                  recipe: req.body,
                  chefsNameAndId
               })
            }
         }
   
         if(removed_files) {
            removed_files = removed_files.split(',')
            const lastIndex = removed_files.length - 1
            removed_files.splice(lastIndex, 1)
            
            const recipeFiles = await File.allRecipeFiles(id)         
   
            if(req.files == 0 && recipeFiles.length == removed_files.length) {
               return res.render(`recipes/edit`, {
                  error: 'É necessário ao menos uma imagem',
                  recipe: req.body,
                  chefsNameAndId
               })
            }
         }
   
         next()   
      } catch (error) {
         console.error(error)  
      }
   }
}