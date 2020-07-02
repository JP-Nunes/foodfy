module.exports = {
   redirectNotUsers(req, res, next) {
      if(!req.session.userId) {
         return res.redirect('/admin/users/login')
      }
   
      next()
   }
}