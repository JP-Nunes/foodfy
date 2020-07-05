const FileLoader = require('../services/LoadFilesService')
const RecipeLoader = require('../services/LoadRecipesService')
const ChefsLoader = require('../services/LoadChefsService')

const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')

module.exports = {
   async index(req, res) {
      try {
         let recipes = await Recipe.allRecipesWithChefsNames()
      
         recipes = await FileLoader.loadRecipesFiles(recipes)

         return res.render('home/index',  { recipes })
      } catch (error) {
         console.error(error)
      }
   },
   async recipes(req, res) {
      try {
         const { page } = req.query

         const { 
            recipes, 
            pagination 
         } = await RecipeLoader.loadPaginatedRecipes(page)

         return res.render('home/recipes', { recipes, pagination })

      } catch (error) {
         console.error(error)   
      }
   },
   async chefs(req, res) {
      try {
         const chefs = await ChefsLoader.loadChefs()
         
         return res.render('home/chefs', { chefs })
      } catch (error) {
         console.error(error)
      }
   },
   async searchRecipes(req, res) {
      try {
         const { filter } = req

         const recipes = 
            await RecipeLoader.loadFilteredRecipes(filter)

         return res.render('home/search', { recipes, filter })
      } catch (error) {
         console.error(error)
      }
   }
}