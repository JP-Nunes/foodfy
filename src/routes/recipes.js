const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const { redirectNotUsers } = require('../app/middlewares/redirectNotUsers')

const RecipeController = require('../app/controllers/RecipeController')

routes.get('/', redirectNotUsers, RecipeController.index)
routes.get('/create', redirectNotUsers, RecipeController.create)
routes.get('/:id', redirectNotUsers, RecipeController.show)
routes.get('/:id/edit', redirectNotUsers, RecipeController.edit)

routes.post('/', multer.array('images', 5), RecipeController.post)
routes.put('/', multer.array('images', 5), RecipeController.put)
routes.delete('/', RecipeController.delete)

module.exports = routes