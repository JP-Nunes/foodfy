const User = require('../models/User')

module.exports = {
   async post(req, res, next) {
      if(req.body.name == "" || req.body.email == "") {
         return res.render('users/register', {
            error: 'Campo nome e email são obrigatórios',
            user: req.body
         })
      }

      if(!req.body.is_admin) {
         req.body = {
            ...req.body,
            is_admin: false
         }
      }

      const user = await User.findOne({ 
         where: { email: req.body.email } 
      })

      if(user) {
         return res.render('users/register', {
            error: 'Email já cadastrado',
            user: req.body
         })
      }

      next()
   },
   put(req, res, next) {
      if(req.body.name == "" || req.body.email == "") {
         return res.render(`users/${req.body.id}/edit`, {
            error: 'Campo nome e email são obrigatórios',
            user: req.body
         })
      }

      if(!req.body.is_admin) {
         req.body = {
            ...req.body,
            is_admin: false
         }
      }

      next()
   }
}