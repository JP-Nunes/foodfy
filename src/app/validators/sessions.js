const { compare } = require('bcryptjs')

const User = require('../models/User')

module.exports = {
   async loginForm(req, res, next) {
      if(req.session.userId) {
         const user = await User.findOne({ 
            where: { id: req.session.userId } 
         })

         return res.render('users/profile', {
            user,
            success: `Bem-vindo, ${user.name}`
         })
      }

      next()
   },
   async login(req, res, next) {
      try {
         const { email, password } = req.body

         const user = await User.findOne({ 
            where: { email } 
         })
         
         if(!user) {
            return res.render('users/login', {
               error: 'Usuário ou senha inválidos',
               user: req.body
            })
         }

         const verified = await compare(password, user.password)

         if(!verified) {
            return res.render('users/login', {
               error: 'Usuário ou senha inválidos',
               user: req.body
            })
         }

         req.user = user

         next()
      } catch (error) {
         console.error(error)
      }
   },
   async forgotPassword(req, res, next) {
      try {
         const { email } = req.body

         let user = await User.findOne({ 
            where: { email }
         })

         if(!user) {
            return res.render('users/forgot-form', {
               error: 'Usuário não encontrado',
               user: req.body
            })
         }

         req.user = user

         next()
      } catch (error) {
         console.error(error)
      }
   },
   async resetPassword(req, res, next) {
      try {
         const { email, newPassword, newPassword_confirm, token } = req.body

         const keys = Object.keys(req.body)

         for(key of keys) {
            if(req.body[key] == 'null') {
               return res.render('users/reset-form', {
                  error: 'Todos os campos são necessários',
                  user: req.body,
                  token
               })
            }
         }

         if(newPassword !== newPassword_confirm) {
            return res.render('users/reset-form', {
               error: 'Senha e confirmação de senha não batem',
               user: req.body,
               token
            })
         }

         let user = await User.findOne({ 
            where: { email } 
         })
         
         if(!user) {
            return res.render('users/reset-form', {
               error: 'Usuário não encontrado',
               user: req.body,
               token
            })
         }

         if(user.reset_token !== token) {
            return res.render('users/reset-form', {
               error: 'Token inválido',
               user: req.body,
               token
            })
         }

         let now = new Date()
         now = now.setHours(now.getHours())

         if(user.reset_token_expires < now) {
            return res.render('users/reset-form', {
               error: 'Seu token expirou',
               user: req.body,
               token
            })
         }

         req.user = user

         next()
      } catch (error) {
         console.error(error)
      }
   }
}