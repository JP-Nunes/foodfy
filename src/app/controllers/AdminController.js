const fs = require('fs')

const data = require('../../data')
const dataJson = require('../../../data.json')

module.exports = {
   index(req, res) {
      recipes = [...data]

      return res.render('recipes/index', { recipes })
   },
   create(req, res) {
      return res.render('recipes/create')
   },
   show(req, res) {
      const recipes = [...data]
      const recipeIndex = req.params.id
      const recipe = recipes[recipeIndex]

      return res.render('recipes/show', { recipe })
   },
   edit(req, res) {
      const recipes = [...data]
      const recipeIndex = req.params.id
      const recipe = recipes[recipeIndex]

      return res.render('recipes/edit', { recipe })
   },
   post(req, res) {
      const keys = Object.keys(req.body)

      for(key of keys) {
         if(req.body[key] == 'null') {
            res.send('Please, fill all fields')
         }
      }

      dataJson.recipes.push(req.body)

      fs.writeFile('data.json', JSON.stringify(dataJson, null, 2), err => { 
         if(err) return res.send("Error") 
      })

      return res.send(recipe)
   },
   put(req, res) {
      return res.send('to be implemented')
   },
   delete(req, res) {
      return res.send('to be implemented')
   }
}