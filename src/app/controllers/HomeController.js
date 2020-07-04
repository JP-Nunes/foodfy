const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')

module.exports = {
   async index(req, res) {
      let recipes = await Recipe.allRecipesWithChefsNames()
      
      const recipesWithFilePromise = recipes.map(async recipe => {
         const recipeFiles = await File.allRecipeFiles(recipe.id)
         const firstFile = recipeFiles[0]

         return recipe = {
            ...recipe,
            image_src: `${req.protocol}://${req.headers.host}${firstFile.path.replace('public', '')}`
         }
      })
      recipes = await Promise.all(recipesWithFilePromise)

      return res.render('home/index',  { recipes })
   },
   async recipes(req, res) {
      try {
         let { page } = req.query

         page = page || 1
         const limit = 6
         let offset = (page - 1) * limit

         const params = {
            limit, offset
         }
         
         let recipes = await Recipe.paginate(params)

         const recipesWithFilePromise = recipes.map(async recipe => {
            const files = await File.allRecipeFiles(recipe.id)
            const firstFile = files[0]

            return recipe = {
               ...recipe,
               image_src: `${req.protocol}://${req.headers.host}${firstFile.path.replace('public', '')}`
            }
         })
         recipes = await Promise.all(recipesWithFilePromise)

         const pagination = {
            page,
            total: Math.ceil(recipes[0].total / limit)
         }

         return res.render('home/recipes', { recipes, pagination })

      } catch (error) {
         console.error(error)   
      }
   },
   async chefs(req, res) {
      try {
         let chefs = await Chef.finAllAndCountRecipes()
         
         const chefsWithFilesPromise = chefs.map(async chef => {
            const file = await File.findOne({ 
               where: { id: chef.file_id}
            })

            return chef = {
               ...chef,
               image_src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }
         })
         chefs = await Promise.all(chefsWithFilesPromise)
         
         return res.render('home/chefs', { chefs })
      } catch (error) {
         console.error(error)
      }
   },
   async searchRecipes(req, res) {
      try {
         const { filter } = req.query

         if(filter) {
            let recipes = await Recipe.filtered(filter)

            const recipesWithFilePromise = recipes.map(async recipe => {
               const files = await File.allRecipeFiles(recipe.id)
               const firstFile = files[0]
   
               return recipe = {
                  ...recipe,
                  image_src: `${req.protocol}://${req.headers.host}${firstFile.path.replace('public', '')}`
               }
            })
            recipes = await Promise.all(recipesWithFilePromise)

            return res.render('home/search', { recipes, filter })
         } else {
            const recipes = await Recipe.findAll()
            
            return res.render('home/search', { recipes })
         }    
      } catch (error) {
         console.error(error)
      }
   }
}