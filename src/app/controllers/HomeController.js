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
      const offset = (page - 1) * limit

      const params = {
         limit, offset
      }
      
      Recipe.paginate(params, recipes => {

         return res.render('home/recipes', { recipes })
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