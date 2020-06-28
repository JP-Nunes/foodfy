const crypto = require('crypto')
const { hash } = require('bcryptjs')

const mailer = require('../../lib/mailer')

const User = require('../models/User')

module.exports = {
   register(req, res) {
      return res.render('users/register')
   },
   async list(req, res) {
      try {
         
         const users = await User.all()

         return res.render('users/index', { users })

      } catch (error) {
         console.error(error)
      }
   },
   async post(req, res) {
      try {

         const password = crypto.randomBytes(3).toString('hex')

         await mailer.sendMail({
            to: req.body.email,
            from: 'contact@foody.com',
            subject: 'Your new password is here!',
            html: `
               <h2>Sua nova senha!</h2>
               <p>${req.body.name}, use a senha, ${password}, para logar no Foodfy!</p>
            `
         })

         const passwordHash = await hash(password, 8)

         req.body = {
            ...req.body,
            password: passwordHash
         }
         
         const user = await User.create(req.body)

         req.session.userId = user.id

         return res.redirect(`/admin/users/${user.id}/edit`)

      } catch (error) {
         console.error(error)
      }
   },
   async edit(req, res) {
      try {

         const user = await User.findOne(req.params.id)

         return res.render('users/edit', { user })
         
      } catch (error) {
         console.error(error)
      }
   },
   async put(req, res) {
      try {
         
         if(!req.body.is_admin) {
            req.body = {
               ...req.body,
               is_admin: false
            }
         }

         await User.update(req.body)

         return res.redirect(`/admin/users/${req.body.id}/edit`)

      } catch (error) {
         console.error(error)
      }
   },
   async delete(req, res) {
      try {
         
         await User.delete(req.body.id)

         return res.redirect('/home/index')

      } catch (error) {
         console.error(error)
      }
   }
}