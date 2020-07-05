const fs = require('fs')

const ChefLoader = require('../services/LoadChefsService')
const RecipeLoader = require('../services/LoadRecipesService')

const Chef = require('../models/Chef')
const File = require('../models/File')

module.exports = {
   async index(req, res) {
      try {
         const chefs = await ChefLoader.loadChefs()
         
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
         const { chef, chefImage } = req

         const chefRecipes = 
            await RecipeLoader.loadChefRecipes(chef.id)
         
         return res.render(`chefs/show`, { 
            chef, 
            image: chefImage, 
            chefRecipes 
         })
      } catch (error) {
         console.error(error)   
      }
   },
   async edit(req, res) {
      try {
         const { chef, chefImage } =
            await ChefLoader.loadChef({
               where: { id: req.params.id }
            })

         console.log(chefImage)

         return res.render('chefs/edit', { chef, image: chefImage })
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
         
         await Chef.create({
            ...req.body,
            file_id: fileId
         })

         const chefs = await ChefLoader.loadChefs()
            
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

         const { chef, chefImage } = 
            await ChefLoader.loadChef({
               where: { id }
            })

         const chefRecipes = 
            await RecipeLoader.loadChefRecipes(id)

         return res.render('chefs/show', {
            chef,
            image: chefImage,
            chefRecipes,
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

         const chefs = await ChefLoader.loadChefs()

         return res.render('chefs/index', {
            chefs,
            success: 'Chef deletado com sucesso!'
         })
      } catch (error) {
         console.error(error)
      }
   }
}