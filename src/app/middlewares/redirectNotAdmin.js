const User = require('../models/User')

module.exports = {
   async redirectNotAdmin(req, res, next) {
      const user = await User.findOne({ 
         where: { id: req.session.userId }
      })
      
      if(user.is_admin === false) {
         return res.redirect('/admin/users/profile')
      }

      next()
   }
}