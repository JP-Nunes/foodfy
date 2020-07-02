const express = require('express')
const routes = express.Router()

const { redirectNotUsers } = require('../app/middlewares/redirectNotUsers')
const { redirectNotAdmin } = require('../app/middlewares/redirectNotAdmin')

const ProfileController = require('../app/controllers/ProfileController')
const UserController = require('../app/controllers/UserController')
const SessionController = require('../app/controllers/SessionController')

const SessionValidator = require('../app/validators/sessions')
const UserValidator = require('../app/validators/users')
const ProfileValidator = require('../app/validators/profiles')

// Session Login
routes.get('/login', SessionController.loginForm)
routes.post('/login',SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// Session Password
routes.get('/forgot-password', SessionController.forgotPasswordForm)
routes.get('/reset-password', SessionController.resetPasswordForm)
routes.post('/forgot', SessionValidator.forgotPassword, SessionController.forgotPassword)
routes.post('/reset', SessionValidator.resetPassword, SessionController.resetPassword)

// Regular User
routes.get('/profile', redirectNotUsers, ProfileController.index)
routes.put('/profile', redirectNotUsers, ProfileValidator.put, ProfileController.put)

// Admin User
routes.get('/', redirectNotUsers, redirectNotAdmin, UserController.list)
routes.get('/register', redirectNotUsers, redirectNotAdmin, UserController.register)
routes.get('/:id/edit', redirectNotUsers, redirectNotAdmin, UserController.edit)
routes.post('/', UserValidator.post, UserController.post)
routes.put('/', UserValidator.put, UserController.put)
routes.delete('/', UserController.delete)

module.exports = routes