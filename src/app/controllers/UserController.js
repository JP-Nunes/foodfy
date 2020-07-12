const crypto = require('crypto')

const mailer = require('../../lib/mailer')
const { hash } = require('bcryptjs')
const FileLoader = require('../services/LoadFilesService')

const User = require('../models/User')
const Recipe = require('../models/Recipe')
const File = require('../models/File')

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
         
         const userId = await User.create(user)

         return res.render('animations/success',{
            message: {
               title: 'Usuário criado com sucesso!',
               message: 'Confira aqui o novo',
               subject: 'usuário'
            },
            entity: {
               path: `users/${userId}/edit`
            }
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

         return res.render('animations/success',{
            message: {
               title: 'Usuário atualizado com sucesso!',
               message: 'Confira aqui a atualização do',
               subject: 'usuário'
            },
            entity: {
               id,
               path: `users/${id}/edit`
            }
         })
      } catch (error) {
         console.error(error)
      }
   },
   async delete(req, res) {
      try {
         const userRecipes = 
            await Recipe.findAll({
               where: { user_id: req.body.id }
            })

         if(userRecipes) {
            const deleteUserRecipesPromise = 
               userRecipes.map(async recipe => {
               
               const chefRecipesFiles = 
                  await FileLoader.loadRecipeFiles(recipe.id)

               const deleteRecipesFilesPromise =
                  chefRecipesFiles.map(file => { 
                     if(file.path != 'public/images/placeholder.png') {
                        fs.unlinkSync(file.path)
                     }

                     File.delete(file.id)
                  })
                  Promise.all(deleteRecipesFilesPromise)
                  
               Recipe.delete(recipe.id)

               return recipe
            })
            await Promise.all(deleteUserRecipesPromise)  
         }

         await User.delete(req.body.id)

         return res.render('animations/done', {
            message: {
               title: 'Usuário deletado com sucesso.',
            }
         })
      } catch (error) {
         console.error(error)
      }
   }
}