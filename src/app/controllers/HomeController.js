const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
   index(req, res) {
      Recipe.all(recipes => {

         return res.render('home/index',  { recipes })
      })
   },
   recipes(req, res) {
      let { page, limit } = req.query

      page = page || 1
      limit = limit || 4
      let offset = (page - 1) * limit

      const params = {
         limit, offset
      }
      
      Recipe.paginate(params, recipes => {

         const pagination = {
            page,
            total: Math.ceil(recipes[0].total / limit)
         }

         console.log(pagination.total)

         return res.render('home/recipes', { recipes, pagination })
      })  
   },
   chefs(req, res) {
      Chef.all(chefs => {
         
         return res.render('home/chefs', { chefs })
      })
   },
   searchRecipes(req, res) {
      const { filter } = req.query

      if(filter) {
         Recipe.filtered(filter, recipes => {

            return res.render('home/search', { recipes, filter })
         })      
      } else {
         Recipe.all(recipes => {
            
            return res.render('home/search', { recipes })
         }
      )}  
   }
}