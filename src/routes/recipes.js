const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const { redirectNotUsers } = require('../app/middlewares/redirectNotUsers')
const { redirectNotAdmin } = require('../app/middlewares/redirectNotAdmin')

const RecipeController = require('../app/controllers/RecipeController')

const Validator = require('../app/validators/recipes')

routes.get('/', redirectNotUsers, RecipeController.index)
routes.get('/create', redirectNotUsers, redirectNotAdmin, RecipeController.create)
routes.get('/:id', redirectNotUsers, redirectNotAdmin, Validator.show, RecipeController.show)
routes.get('/:id/edit', redirectNotUsers, redirectNotAdmin, RecipeController.edit)

routes.post('/', multer.array('images', 5), Validator.post, RecipeController.post)
routes.put('/', multer.array('images', 5), Validator.put, RecipeController.put)
routes.delete('/', RecipeController.delete)

module.exports = routes