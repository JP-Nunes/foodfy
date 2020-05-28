const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
   async index(req, res) {
      const recipes = await Recipe.all()

      return res.render('home/index',  { recipes })
   },
   async recipes(req, res) {
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

         return res.render('home/recipes', { recipes, pagination })

      } catch (error) {
         console.error(error)   
      }
   },
   async chefs(req, res) {
      try {
         
         const chefs = await Chef.all()
         
         return res.render('home/chefs', { chefs })
      
      } catch (error) {
         console.error(error)
      }
   },
   async searchRecipes(req, res) {
      try {
         
         const { filter } = req.query

         if(filter) {
            
            const recipes = await Recipe.filtered(filter)

            return res.render('home/search', { recipes, filter })
      
         } else {
            
            const recipes = await Recipe.all()
            
            return res.render('home/search', { recipes })
         }    
      } catch (error) {
         console.error(error)
      }
   }
}