const Recipe = require('../models/Recipe')
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
         
         const recipes = await Recipe.paginate(params)

         const pagination = {
            page,
            total: Math.ceil(recipes[0].total / limit)
         }

         return res.render('recipes/index', { recipes, pagination })

      } catch (error) {
         console.error(error)   
      }
   },
   async create(req, res) {
      try {
         
         const chefsNameAndId = await Recipe.nameAndId()
         
         return res.render('recipes/create', { chefsNameAndId })
      
      } catch (error) {
         console.error(error)   
      }
   },
   async show(req, res) {
      try {
         
         const recipe = await Recipe.find(req.params.id)

         return res.render('recipes/show', { recipe })

      } catch (error) {
         console.error(error)
      }
   },
   async edit(req, res) {
      try {
         
         const recipe = await Recipe.find(req.params.id)
         
         if(!recipe) return res.send('Recipe not found')
   
         const chefsNameAndId = Recipe.nameAndId()
   
         return res.render('recipes/edit', { recipe, chefsNameAndId })

      } catch (error) {
         console.error(error)
      }
   },
   async post(req, res) {
      try {
         
         const keys = Object.keys(req.body)

         for(key of keys) {
            if(req.body[key] == 'null') {
               return res.send('Please, fill all fields')
            }
         }

         if(req.files.length < 1) {
            return res.send('É necessário ao menos 1 imagem')
         }

         const recipe = await Recipe.post(req.body)

         const filesPromise = req.files.map(file => {
            File.post({ ...file, recipe_id: recipe.id })
            File.postRecipeFiles({ file_id: file.id, recipe_id: recipe.id })
         })

         await Promise.all(filesPromise)

         return res.redirect(`admin/recipes/${recipe.id}`)

      } catch (error) {
         console.error(error)
      }
   },
   async put(req, res) {
      try {
         const keys = Object.keys(req.body)

         for(key of keys) {
            if(req.body[key] == 'null') {
               res.send('Please, fill all fields')
            }
         }
         
         await Recipe.put(req.body)

         return res.redirect(`recipes/${req.body.id}`)
         
      } catch (error) {
         console.error(error)
      }
   },
   async delete(req, res) {
      try {
         
         Recipe.delete(req.body.id)

         return res.redirect('recipes')

      } catch (error) {
         console.error(error)
      }
   }
}