const express = require('express')
const data = require('./data')
const routes = express.Router()

const AdminController = require('./app/controllers/AdminController')

routes.get('/', (req, res) => {
   const recipes = [...data]

   return res.render('home/index', { recipes })
})

routes.get('/admin/recipes', AdminController.index)
routes.get('/admin/recipes/create', AdminController.create)
routes.get('/admin/recipes/:id', AdminController.show)
routes.get('/admin/recipes/:id/edit', AdminController.edit)

routes.post('/admin/recipes', AdminController.post)
routes.put('/admin/recipes', AdminController.put)
routes.delete('/admin/recipes', AdminController.delete)

module.exports = routes