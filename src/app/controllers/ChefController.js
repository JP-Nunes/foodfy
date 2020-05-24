const Chef = require('../models/Chef')

module.exports = {
   index(req, res) {
      Chef.all((chefs) => {
         
         return res.render('chefs/index', { chefs })
      })
      
   },
   create(req, res) {
      return res.render('chefs/create')
   },
   show(req, res) {
      Chef.find(req.params.id, chef => {
         if(!chef) return res.send('Chef not found')

         Chef.findChefRecipes(req.params.id, chefRecipesData => {

            return res.render(`chefs/show`, { chef, chefRecipesData })
         })
      })
   },
   edit(req, res) {
      Chef.find(req.params.id, chef => {

         return res.render('chefs/edit', { chef })
      })
   },
   post(req, res) {
      const keys = Object.keys(req.body)

      for(key of keys) {
         if(req.body[key] == '') {
            return res.send('Please, fill all fields')
         }
      }

      Chef.post(req.body, function(chef) {
         return res.redirect(`chefs/${chef.id}`)
      })
   },
   put(req, res) {
      Chef.put(req.body, () => {

         return res.redirect(`chefs/${req.body.id}`)
      })
   },
   delete(req, res) {
      return res.send('To be implemented')
   }
}