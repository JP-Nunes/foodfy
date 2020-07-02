const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const { redirectNotUsers } = require('../app/middlewares/redirectNotUsers')
const { redirectNotAdmin } = require('../app/middlewares/redirectNotAdmin')

const ChefController = require('../app/controllers/ChefController')

const Validator = require('../app/validators/chefs')

routes.get('/', redirectNotUsers, ChefController.index)
routes.get('/create', redirectNotUsers, redirectNotAdmin, ChefController.create)
routes.get('/:id', redirectNotUsers, redirectNotAdmin, Validator.show, ChefController.show)
routes.get('/:id/edit', redirectNotUsers, redirectNotAdmin, ChefController.edit)

routes.post('/', multer.single('image'), Validator.post, ChefController.post)
routes.put('/', multer.single('image'), Validator.put, ChefController.put)
routes.delete('/', ChefController.delete)

module.exports = routes