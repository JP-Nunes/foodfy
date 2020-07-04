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
         const users = await User.findAll()

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

         const user = {
            ...req.body,
            password: passwordHash
         }
         
         await User.create(user)

         const users = await User.findAll()

         return res.render('users/index', {
            users,
            success: 'Usuário registrado com sucesso!'
         })
      } catch (error) {
         console.error(error)
      }
   },
   async edit(req, res) {
      try {
         const user = await User.findOne({ 
            where: { id: req.params.id } 
         })

         return res.render('users/edit', { user })
      } catch (error) {
         console.error(error)
      }
   },
   async put(req, res) {
      try {
         const { id, name, email, is_admin } = req.body

         await User.update(id, {
            name,
            email,
            is_admin
         })

         return res.render('users/edit', {
            user: req.body,
            success: 'Usuário atualizado com sucesso!'
         })
      } catch (error) {
         console.error(error)
      }
   },
   async delete(req, res) {
      try {
         await User.delete(req.body.id)

         const users = await User.findAll()

         return res.render('users/index', {
            users,
            success: 'Usuário deletado com sucesso!'
         })
      } catch (error) {
         console.error(error)
      }
   }
}