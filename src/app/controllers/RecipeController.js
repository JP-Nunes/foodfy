const Recipe = require('../models/Recipe')

module.exports = {
   index(req, res) {
      let { page, limit } = req.query

      page = page || 1
      limit = limit || 4
      let offset = (page - 1) * limit

      const params = {
         limit, offset
      }
      
      Recipe.paginate(params, recipes => {

         return res.render('recipes/index', { recipes })
      })     
   },
   create(req, res) {
      Recipe.nameAndId(data => {

         return res.render('recipes/create', { chefsNameAndId: data })
      })

   },
   show(req, res) {
      Recipe.find(req.params.id, recipe => {

         return res.render('recipes/show', { recipe })
      })
   },
   edit(req, res) {
      Recipe.find(req.params.id, recipe => {
         if(!recipe) return res.send('Recipe not found')

         Recipe.nameAndId(data => {

            return res.render('recipes/edit', { recipe, chefsNameAndId: data })
         })
      })
   },
   post(req, res) {
      const keys = Object.keys(req.body)

      for(key of keys) {
         if(req.body[key] == 'null') {
            res.send('Please, fill all fields')
         }
      }

      Recipe.post(req.body, (recipe) => { 
         
         return res.redirect(`/recipes/${recipe.id}`)
      })

   },
   put(req, res) {
      Recipe.put(req.body, () => {

         return res.redirect(`recipes/${req.body.id}`)
      })


   },
   delete(req, res) {
      Recipe.delete(req.body.id, () => {

         return res.redirect('recipes')
      })

      
   }
}