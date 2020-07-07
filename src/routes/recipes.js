const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const { 
   redirectNotUsers,
   redirectNotAdmin,
   redirectNotRecipeCreator 
} = require('../app/middlewares/redirect')

const RecipeController = require('../app/controllers/RecipeController')

const Validator = require('../app/validators/recipes')

routes.get('/', redirectNotUsers, RecipeController.index)
routes.get('/user', redirectNotUsers, RecipeController.user)
routes.get(
   '/create', 
   redirectNotUsers, 
   RecipeController.create)
routes.get(
   '/:id', 
   redirectNotUsers, 
   Validator.show, 
   RecipeController.show
)
routes.get(
   '/:id/edit', 
   redirectNotUsers, 
   redirectNotRecipeCreator, 
   RecipeController.edit
)

routes.post(
   '/', 
   multer.array('images', 5), 
   Validator.post, 
   RecipeController.post
)
routes.put(
   '/', 
   multer.array('images', 5), 
   Validator.put, 
   RecipeController.put
)
routes.delete('/', RecipeController.delete)

module.exports = routes