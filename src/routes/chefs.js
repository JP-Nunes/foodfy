const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')

const ChefController = require('../app/controllers/ChefController')

routes.get('/', ChefController.index)
routes.get('/create', ChefController.create)
routes.get('/:id', ChefController.show)
routes.get('/:id/edit', ChefController.edit)

routes.post('/', multer.single('image'), ChefController.post)
routes.put('/', multer.single('image'), ChefController.put)
routes.delete('/', ChefController.delete)

module.exports = routes