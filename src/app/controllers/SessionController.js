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

         const { email, password } = req.body

         let user = await User.findOne({ where: { email } })
         
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

         const passwordHash = await hash(password, 8)

         user = {
            ...user,
            password: passwordHash
         }

         await User.update(user)

         return res.send('Ok')

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
   async forgotPassword(req, res) {
      try {
         const token = crypto.randomBytes(20).toString('hex')

         let now = new Date()
         now = now.setHours(now.getHours() + 1)
         
         const { email } = req.body

         let user = await User.findOne({ where: { email }})
         user = {
            ...user,
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

         return res.send('Cheque seu email')

      } catch (error) {
         console.error(error)
      }
   },
   resetPasswordForm(req, res) {
      return res.render('users/reset-form', { token: req.query.token })
   },
   async resetPassword(req, res) {
      try {
         const { email, newPassword, newPassword_confirm, token } = req.body


         if(newPassword !== newPassword_confirm) {
            return res.send('Senha e confirmação não batem')
         }

         let user = await User.findOne({ where: { email } })
         
         if(user.reset_token !== token) {
            return res.send('Token inválido')
         }

         if(!user) {
            return res.send('Usuário não encontrado')
         }

         let now = new Date()
         now = now.setHours(now.getHours())

         if(user.reset_token_expires < now) {
            return res.send('Seu token expirou')
         }

         const passwordHash = await hash(newPassword, 8)

         user = {
            ...user,
            password: passwordHash
         }

         await User.update(user)

         return res.send('Ok')
         
      } catch (error) {
         console.error(error)
      }
   }
}