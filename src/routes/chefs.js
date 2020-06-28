const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const { redirectNotUsers } = require('../app/middlewares/redirectNotUsers')

const ChefController = require('../app/controllers/ChefController')

routes.get('/', redirectNotUsers, ChefController.index)
routes.get('/create', redirectNotUsers, ChefController.create)
routes.get('/:id', redirectNotUsers, ChefController.show)
routes.get('/:id/edit', redirectNotUsers, ChefController.edit)

routes.post('/', multer.single('image'), ChefController.post)
routes.put('/', multer.single('image'), ChefController.put)
routes.delete('/', ChefController.delete)

module.exports = routes