const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
   index(req, res) {
      Recipe.all(recipes => {

         return res.render('home/index', { recipes })
      })      
   },
   recipes(req, res) {
      Recipe.all(recipes => {

         return res.render('home/recipes', { recipes })
      })
   },
   chefs(req, res) {
      Chef.all(chefs => {
         
         return res.render('home/chefs', { chefs })
      })
   }
}