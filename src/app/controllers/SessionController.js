const { compare } = require('bcryptjs')

const User = require('../models/User')

module.exports = {
   loginForm(req, res) {

      return res.render('users/login')
   },
   async login(req, res) {
      try {

         const { email, password } = req.body

         const user = await User.findOne({ where: { email } })
         
         if(!user) {
            return res.send('Usuário não cadastrado')
         }

         const verified = await compare(password, user.password)

         if(!verified) {
            return res.send('Senha incorreta')
         }

         req.session.userId = user.id

         if(req.session.userId) {
            return res.redirect('/admin/users/profile')
         }

      } catch (error) {
         console.error(error)
      }
   },
   logout(req, res) {
      req.session.destroy()

      return res.redirect('/admin/users/login')

   },
   forgotPasswordForm(req, res) {

      return res.render('users/forgot-form')
   },
   resetPasswordForm(req, res) {

      return res.render('users/reset-form')
   },
   forgotPassword(req, res) {

   },
   resetPassword(req, res) {

   }
}