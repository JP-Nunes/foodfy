const fs = require('fs')

const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const User = require('../models/User')
const File = require('../models/File')

module.exports = {
   async index(req, res) {
      try {
         let { page, limit } = req.query

         page = page || 1
         limit = limit || 4
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

         if(recipes[0]) {
            const pagination = {
               page,
               total: Math.ceil(recipes[0].total / limit)   
            }
            
            return res.render('recipes/index', { recipes, pagination })
         } else {
            return res.render('recipes/index')
         }
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

         const recipeFiles = await File.allRecipeFiles(recipe.id)
         const files = recipeFiles.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
         }))

         return res.render('recipes/show', { recipe, files })
      } catch (error) {
         console.error(error)
      }
   },
   async edit(req, res) {
      try {  
         const recipe = await Recipe.findOne({
            where: { id: req.params.id}
         })
         
         const recipeFiles = await File.allRecipeFiles(recipe.id)
         const files = recipeFiles.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
         }))
   
         const chefsNameAndId = await Chef.nameAndId()
   
         return res.render('recipes/edit', { recipe, chefsNameAndId, files })
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

         return res.render('recipes/index', {
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

         const data = {
            ...req.body,
            user_id: req.session.userId
         }

         await Recipe.put(data)

         return res.render('recipes/show', {
            recipe: data,
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

         return res.render('recipes/index', {
            success: 'receita deletada com sucesso!'
         })
      } catch (error) {
         console.error(error)
      }
   }
}