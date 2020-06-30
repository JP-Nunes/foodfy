const express = require('express')
const routes = express.Router()

const { redirectNotUsers } = require('../app/middlewares/redirectNotUsers')

const ProfileController = require('../app/controllers/ProfileController')
const UserController = require('../app/controllers/UserController')
const SessionController = require('../app/controllers/SessionController')

// Session Login
routes.get('/login', SessionController.loginForm)
routes.post('/login', SessionController.login)
routes.post('/logout', SessionController.logout)

// Session Password
routes.get('/forgot-password', SessionController.forgotPasswordForm)
routes.get('/reset-password', SessionController.resetPasswordForm)
routes.post('/forgot', SessionController.forgotPassword)
routes.post('/reset', SessionController.resetPassword)

// Regular User
routes.get('/profile', redirectNotUsers, ProfileController.index)
routes.put('/profile', redirectNotUsers, ProfileController.put)

// Admin User
routes.get('/', redirectNotUsers, UserController.list)
routes.get('/register', redirectNotUsers, UserController.register)
routes.get('/:id/edit', redirectNotUsers, UserController.edit)
routes.post('/', UserController.post)
routes.put('/', UserController.put)
routes.delete('/', UserController.delete)

module.exports = routes