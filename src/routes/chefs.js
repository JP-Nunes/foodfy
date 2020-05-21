const express = require('express')
const routes = express.Router()

const ChefController = require('../app/controllers/ChefController')

routes.get('/', ChefController.index)
routes.get('/create', ChefController.create)
routes.get('/:id', ChefController.show)
routes.get('/:id/edit', ChefController.edit)

routes.post('/', ChefController.post)
routes.put('/', ChefController.put)
routes.delete('/', ChefController.delete)

module.exports = routes