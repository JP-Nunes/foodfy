const data = require('../../data')

module.exports = {
   index(req, res) {
      recipes = [...data]

      res.render('recipes/index', { recipes })
   },
   create(req, res) {
      res.render('recipes/create')
   },
   show(req, res) {
      const recipes = [...data]
      const recipeIndex = req.params.id
      const recipe = recipes[recipeIndex]

      return res.render('recipes/show', { recipe })
   },
   edit(req, res) {
      res.send('to be implemented')
   },
   post(req, res) {
      const recipe = req.body

      res.send(recipe)
   },
   put(req, res) {
      res.send('to be implemented')
   },
   delete(req, res) {
      res.send('to be implemented')
   }
}