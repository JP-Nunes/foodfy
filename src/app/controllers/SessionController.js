const crypto = require('crypto')
const { compare, hash } = require('bcryptjs')
const mailer = require('../../lib/mailer')

const User = require('../models/User')

module.exports = {
   loginForm(req, res) {
      return res.render('users/login')
   },
   async login(req, res) {
      try {
         req.session.userId = req.user.id

         if(req.session.userId) {
            return res.redirect('/admin/users/profile')
         }
      } catch (error) {
         console.error(error)
      }
   },
   logout(req, res) {
      console.log(req.session)
      req.session.destroy()

      return res.redirect('/admin/users/login')
   },
   forgotPasswordForm(req, res) {
      return res.render('users/forgot-form')
   },
   async forgotPassword(req, res) {
      try {
         const token = crypto.randomBytes(20).toString('hex')

         let now = new Date()
         now = now.setHours(now.getHours() + 1)
         
         const user = {
            ...req.user,
            token,
            token_expires: now
         }
         
         await User.update(user)

         await mailer.sendMail({
            to: user.email,
            from: 'contact@foody.com',
            subject: 'Recuperação de senha',
            html: `
               <h2>Esqueceu a senha?</h2>
               <p>Não se preocupe, é só clicar no link abaixo</p>
               <p>
                  <a 
                     href="http://localhost:3000/admin/users/reset-password?token=${token}" 
                     target="_blank"
                  >
                     Recuperar Senha
                  </a>
               </p>
            `
         })

         return res.render('users/forgot-form', {
            success: 'Verifique seu e-mail para recuperar sua senha',
            user: req.body
         })
      } catch (error) {
         console.error(error)
      }
   },
   resetPasswordForm(req, res) {
      return res.render('users/reset-form', { token: req.query.token })
   },
   async resetPassword(req, res) {
      try {
         const passwordHash = await hash(req.body.newPassword, 8)

         const user = {
            ...req.user,
            password: passwordHash
         }

         await User.update(user)

         return res.render('users/login', {
            success: 'Senha alterada com sucesso!'
         })
      } catch (error) {
         console.error(error)
      }
   }
}