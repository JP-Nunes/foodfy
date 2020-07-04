const fs = require('fs')

const Chef = require('../models/Chef')
const File = require('../models/File')

module.exports = {
   async index(req, res) {
      try {
         let chefs = await Chef.finAllAndCountRecipes() 

         const chefsWithFilePromise = chefs.map(async chef => {
            const file = await File.findOne({
               where: { id: chef.file_id }
            })

            return chef = {
               ...chef,
               image_src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }
         })
         chefs = await Promise.all(chefsWithFilePromise)
         
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
         const { chef } = req

         let chefImage = await File.findOne({
            where: { id: chef.file_id }
         })
         
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
         const chef = await Chef.findOne({ 
            where: { id: req.params.id }
         })
         let file = await File.findOne({ 
            where: { id: chef.file_id }
         })

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
         const { filename, path } = req.file

         const fileId = await File.create({
            name: filename,
            path
         })
         
         const chef = {
            ...req.body,
            file_id: fileId
         }
         await Chef.create(chef)

         const chefs = await Chef.findAll()
            
         return res.render('chefs/index',{
            chefs,
            success: 'Chef criado com sucesso!'
         })
      } catch (error) {
         console.error(error)   
      }
   },
   async put(req, res) {
      try {
         const { id, name, file_id} = req.body

         if(req.file) {
            const oldFile = await File.findOne({
               where: { id: file_id }
            })

            fs.unlinkSync(oldFile.path)

            const { filename, path } = req.file

            await File.update(file_id, {
               name: filename,
               path
            })
         }
         
         await Chef.update(id, {
            name,
         })

         const chef = await Chef.findOne({
            where: { id }
         })

         return res.render('chefs/show', {
            chef,
            success: 'Chef atualizado com sucesso!'
         })
      } catch (error) {
         console.error(error)
      }
   },
   async delete(req, res) {
      try {
         await Chef.delete(req.body.id)
         
         const file = await File.findOne({
            where: { id: req.body.file_id } 
         })

         fs.unlinkSync(file.path)
         
         await File.delete(req.body.file_id)

         const chefs = await Chef.findAll()

         return res.render('chefs/index', {
            chefs,
            success: 'Chef deletado com sucesso!'
         })   
      } catch (error) {
         console.error(error)
      }
   }
}