const RecipeLoader = require('../services/LoadRecipesService')
const FileLoader = require('../services/LoadFilesService')

const Recipe = require("../models/Recipe")
const Chef = require("../models/Chef")

function format(recipe) {
   const filteredPreparation = 
      recipe.preparation.filter(step => {
         return step != ''
      })
   
      
   const filteredIngredients = 
      recipe.ingredients.filter(ingredient => {
         return ingredient != ''
      })
      
   recipe = {
      ...recipe,
      ingredients: filteredIngredients,
      preparation: filteredPreparation
   }

   return recipe
}

module.exports = {
   async index(req, res, next) {
      const { page } = req.query

      const { 
         recipes, 
         pagination 
      } = await RecipeLoader.loadPaginatedRecipes(page)

      if(!recipes) {
         return res.render('recipes/index')
      }

      req.recipes = recipes
      req.pagination = pagination

      next()
   },
   async show(req, res, next) {
      try {
         const {
            recipe,
            recipeFiles
         } = await RecipeLoader.loadRecipe(req.params.id)

         if(!recipe) {
            return res.render('recipes/index', {
               error: 'Receita não encontrada',
            })
         }
         
         req.recipe = recipe
         req.recipeFiles = recipeFiles

         next()   
      } catch (error) {
         console.error(error)
      }
   },
   async user(req, res, next) {      
      let recipes = await Recipe.findAll()

      recipes = recipes.filter(recipe => {
         return recipe.user_id == req.session.userId
      })
            
      if(recipes.length < 1) {
         return res.render('users/index', {
            error: 'Nenhuma receita criada'
         })
      }

      next()
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
         
         const formattedRecipe = format(req.body)
         
         if(!formattedRecipe.preparation[0] ||
            !formattedRecipe.ingredients[0]) {
            return res.render('recipes/create', {
               error: 'Todos os campos são necessários',
               recipe: req.body,
               chefsNameAndId
            }) 
         }

         req.newRecipe = formattedRecipe

         next()
      } catch (error) {
         console.error(error)
      }
      
   },
   async put(req, res, next) {
      try {
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

         const recipeFiles = 
            await FileLoader.loadRecipeFiles(req.body.id)        
         
         if(removed_files) {
            removed_files = removed_files.split(',')
            const lastIndex = removed_files.length - 1
            removed_files.splice(lastIndex, 1)
            
            if(req.files == 0 && recipeFiles.length == removed_files.length) {
               return res.render(`recipes/edit`, {
                  error: 'É necessário ao menos uma imagem',
                  recipe: req.body,
                  chefsNameAndId
               })
            }
         }
         
         const formattedRecipe = format(req.body)

         if(!formattedRecipe.preparation[0] ||
            !formattedRecipe.ingredients[0]) {
            return res.render(`recipes/edit`, {
               error: 'Todos os campos são necessários',
               recipe: req.body,
               chefsNameAndId
            }) 
         }
         
         req.recipe = formattedRecipe

         next()   
      } catch (error) {
         console.error(error)  
      }
   }
}