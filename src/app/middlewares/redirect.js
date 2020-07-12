const Recipe = require('../models/Recipe')
const User = require('../models/User')

module.exports = {
   redirectNotUsers(req, res, next) {
      if(!req.session.userId) {
         return res.redirect('/admin/users/login')
      }
   
      next()
   },
   async redirectNotAdmin(req, res, next) {
      const user = await User.findOne({ 
         where: { id: req.session.userId }
      })
      
      if(user.is_admin === false) {
         return res.render('users/profile', {
            error: 'Acesso negado',
            user
         })
      }

      next()
   },
   async redirectNotRecipeCreator(req, res, next) {
      const recipe = await Recipe.findOne({
         where: { id: req.params.id }
      })
      
      const user = await User.findOne({ 
         where: { id: req.session.userId }
      })
      
      if(
         user.is_admin === false && 
         recipe.user_id != user.id
         ) {
         return res.render('users/profile', {
            error: 'Acesso negado',
            user
         })
      }

      next()
   } 
}