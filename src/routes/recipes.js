const express = require('express')
const routes = express.Router()

const RecipeController = require('../app/controllers/RecipeController')

routes.get('/', RecipeController.index)
routes.get('/create', RecipeController.create)
routes.get('/:id', RecipeController.show)
routes.get('/:id/edit', RecipeController.edit)

routes.post('/', RecipeController.post)
routes.put('/', RecipeController.put)
routes.delete('/', RecipeController.delete)

module.exports = routes