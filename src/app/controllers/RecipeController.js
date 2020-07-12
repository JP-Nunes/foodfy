const fs = require('fs')

const RecipeLoader = require('../services/LoadRecipesService')
const FileLoader = require('../services/LoadFilesService')

const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')
const User = require('../models/User')

module.exports = {
   async index(req, res) {
      try {
         const { 
            recipes,
            pagination
         } = req
         
         return res.render('recipes/index', { 
            recipes, 
            pagination 
         })
      } catch (error) {
         console.error(error)   
      }
   },
   async user(req, res) {
      try {
         const { page } = req.query

         const { 
            recipes, 
            pagination 
         } = await RecipeLoader.loadPaginatedRecipes(
            page,
            req.session.userId
         )
         
         return res.render('recipes/index', { recipes, pagination })
      } catch (error) {
         console.error(error)
      }
   },
   async create(req, res) {
      try {
         const chefsNameAndId = await Chef.nameAndId()
         
         return res.render('recipes/create', { chefsNameAndId })
      } catch (error) {
         console.error(error)   
      }
   },
   async show(req, res) {
      try {
         const { recipe, recipeFiles } = req

         const user = await User.findOne({
            where: { id: req.session.userId }
         })

         return res.render('recipes/show', { 
            recipe,
            user: {
               is_admin: user.is_admin
            },
            files: recipeFiles 
         })
      } catch (error) {
         console.error(error)
      }
   },
   async edit(req, res) {
      try {  
         const {
            recipe,
            recipeFiles
         } = await RecipeLoader.loadRecipe(req.params.id)
   
         const chefsNameAndId = await Chef.nameAndId()
   
         return res.render('recipes/edit', { 
            recipe, 
            chefsNameAndId, 
            files: recipeFiles 
         })
      } catch (error) {
         console.error(error)
      }
   },
   async post(req, res) {
      try {
         const { newRecipe } = req

         const recipe = {
            ...newRecipe,
            user_id: req.session.userId
         }

         const recipeId = await Recipe.post(recipe)

         const filesPromise = req.files.map(file => {
            File.create({ 
               name: file.filename,
               path: file.path
            })
            return file
         })         
         const files = await Promise.all(filesPromise)

         const recipeFilesPromise = files.map(async file => {
            const dataBaseFile = await File.findOne({
               where: { name: file.filename }
            })
            
            File.postRecipeFiles({
               recipe_id: recipeId,
               file_id: dataBaseFile.id
            })
         })
         await Promise.all(recipeFilesPromise)

         return res.render('animations/success',{
            message: {
               title: 'Receita criada com sucesso!',
               message: 'Confira aqui a nova',
               subject: 'receita'
            },
            entity: {
               id: recipeId,
               path: `recipes/${recipeId}`
            }
         })
      } catch (error) {
         console.error(error)
      }
   },
   async put(req, res) {
      try {
         let { recipe } = req

         if(req.files) {
            const filesPromise = req.files.map(async file => {
               await File.create({
                  name: file.filename,
                  path: file.path
               })
               return file
            })         
            const files = await Promise.all(filesPromise)
            
            const recipeFilesPromise = files.map(async file => {
               const dataBaseFile = await File.findOne({
                  where: { name: file.filename }
               })
               
               File.postRecipeFiles({
                  recipe_id: recipe.id,
                  file_id: dataBaseFile.id
               })
            })
            await Promise.all(recipeFilesPromise)
         }

         if(recipe.removed_files) {
            const removedFilesIds = recipe.removed_files.split(',')
            const lastIndex = removedFilesIds.length - 1
            removedFilesIds.splice(lastIndex, 1)
            
            const removedFilesPromise = 
               removedFilesIds.map(async id => {
                  const file = await File.findOne({
                     where: { id }
                  })

                  if(file.path != 'public/images/placeholder.png') {
                     fs.unlinkSync(file.path)
                  }
                  
                  File.delete(id)
               })
            await Promise.all(removedFilesPromise)
         }

         recipe = {
            ...recipe,
            user_id: req.session.userId
         }

         await Recipe.put(recipe)

         return res.render('animations/success',{
            message: {
               title: 'Receita atualizada com sucesso!',
               message: 'Confira aqui a atualização da',
               subject: 'receita'
            },
            entity: {
               id: recipe.id,
               path: `recipes/${recipe.id}`
            }
         })
      } catch (error) {
         console.error(error)
      }
   },
   async delete(req, res) {
      try {
         const files = 
            await FileLoader.loadRecipeFiles(req.body.id)

         const removeFilesPromise = files.map(file => {            
            if(file.path != 'public/images/placeholder.png') {
               fs.unlinkSync(file.path)
            }
            
            File.delete(file.id)
         })
         Promise.all(removeFilesPromise)
         
         await Recipe.delete(req.body.id)

         return res.render('animations/done', {
            message: {
               title: 'Receita deletada com sucesso.',
            }
         })
      } catch (error) {
         console.error(error)
      }
   }
}