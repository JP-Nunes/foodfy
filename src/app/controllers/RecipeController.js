const fs = require('fs')

const LoadRecipeService = require('../services/LoadRecipesService')
const LoadFileService = require('../services/LoadFilesService')

const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')

module.exports = {
   async index(req, res) {
      try {
         const { page } = req.query

         const { 
            recipes, 
            pagination 
         } = await LoadRecipeService.loadPaginatedRecipes(page)
         
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
         const { recipe } = req

         const recipeFiles = 
            await LoadFileService.loadRecipeFiles(recipe.id)

         return res.render('recipes/show', { 
            recipe, 
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
         } = await LoadRecipeService.loadRecipe({ 
            where: { id: req.params.id }
         })
   
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
         const recipe = {
            ...req.body,
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

         const {
            recipes,
            pagination
         } = await LoadRecipeService.loadPaginatedRecipes()

         return res.render('recipes/index', {
            recipes,
            pagination,
            success: 'Receita criada com sucesso!'
         })
      } catch (error) {
         console.error(error)
      }
   },
   async put(req, res) {
      try {      
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
                  recipe_id: req.body.id,
                  file_id: dataBaseFile.id
               })
            })
            await Promise.all(recipeFilesPromise)
         }

         if(req.body.removed_files) {
            const removedFilesIds = req.body.removed_files.split(',')
            const lastIndex = removedFilesIds.length - 1
            removedFilesIds.splice(lastIndex, 1)
            
            const removedFilesPromise = removedFilesIds.map(id => {
               File.delete(id)
            })
            await Promise.all(removedFilesPromise)
         }

         const recipe = {
            ...req.body,
            user_id: req.session.userId
         }

         await Recipe.put(recipe)

         const recipeFiles = 
            await LoadFileService.loadRecipeFiles(recipe.id)

         return res.render('recipes/show', {
            recipe,
            files: recipeFiles,
            success: 'Receita atualizada com sucesso!'
         })
      } catch (error) {
         console.error(error)
      }
   },
   async delete(req, res) {
      try {
         const files = await File.allRecipeFiles(req.body.id)

         const removeFilesPromise = files.map(async file => {
            const dataBaseFile = await File.findOne({
               where: { id: file.id } 
            })

            fs.unlinkSync(dataBaseFile.path)
            
            File.delete(file.id)
         })
         Promise.all(removeFilesPromise)
         
         await Recipe.delete(req.body.id)

         const {
            recipes,
            pagination
         } = await LoadRecipeService.loadPaginatedRecipes()

         return res.render('recipes/index', {
            recipes,
            pagination,
            success: 'Receita deletada com sucesso!'
         })
      } catch (error) {
         console.error(error)
      }
   }
}