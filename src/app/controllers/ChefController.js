const Chef = require('../models/Chef')
const File = require('../models/File')

module.exports = {
   async index(req, res) {
      try {
         
         let chefs = await Chef.all() 

         const chefsWithFilesPromise = chefs.map(async chef => {
            const file = await File.find(chef.file_id)

            return chef = {
               ...chef,
               image_src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }
         })
         chefs = await Promise.all(chefsWithFilesPromise)
         
         return res.render('chefs/index', { chefs })

      } catch (error) {
         console.error(error)
      }      
   },
   create(req, res) {
      return res.render('chefs/create')
   },
   async show(req, res) {
      try {

         const chef = await Chef.find(req.params.id)

         if(!chef) return res.send('Chef not found')
         
         let chefImage = await File.find(chef.file_id)
         
         chefImage = {
            ...chefImage,
            src: `${req.protocol}://${req.headers.host}${chefImage.path.replace('public', '')}`
         }

         let chefRecipes = await Chef.findChefRecipes(req.params.id)

         const chefRecipesPromise = chefRecipes.map(async recipe => {
            const recipeFiles = await File.allRecipeFiles(recipe.id)
            const recipeFirstFile = recipeFiles[0]

            return recipe = {
               ...recipe,
               image_src: `${req.protocol}://${req.headers.host}${recipeFirstFile.path.replace('public', '')}`
            }
         })
         chefRecipes = await Promise.all(chefRecipesPromise)
         
         return res.render(`chefs/show`, { chef, chefRecipes, image: chefImage })

      } catch (error) {
         console.error(error)   
      }
   },
   async edit(req, res) {
      try {
         
         const chef = await Chef.find(req.params.id)
         let file = await File.find(chef.file_id)

         file = {
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
         }

         file.src = file.src.replace(/\\/g, '/')

         return res.render('chefs/edit', { chef, file })
      
      } catch (error) {
         console.error(error)
      }
   },
   async post(req, res) {
      try {

         if(!req.file) {
            return res.send('É necessário ao menos 1 imagem')
         }

         const file = await File.post(req.file)
         
         const chef = await Chef.post(req.body, file.id)

         console.log(chef)
            
         return res.redirect(`chefs/${chef.id}`)
      
      } catch (error) {
         console.error(error)   
      }
   },
   async put(req, res) {
      
      if(!req.file) {
         return res.send('É necessário ao menos 1 imagem')
      }

      await File.put(req.file, req.body.file_id)
      await Chef.put(req.body)
      
      return res.redirect(`chefs/${req.body.id}`)

   },
   async delete(req, res) {
      
      await Chef.delete(req.body.id)
      await File.delete(req.body.file_id)

      return res.redirect('/chefs')
   }
}