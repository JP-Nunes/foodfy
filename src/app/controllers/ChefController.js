const Chef = require('../models/Chef')

module.exports = {
   async index(req, res) {
      try {
         
         const chefs = await Chef.all() 
         
         return res.render('chefs/index', { chefs })

      } catch (error) {
         console.error(error)
      }      
   },
   create(req, res) {
      return res.render('chefs/create')
   },
   async show(req, res) {
      try {

         const chef = await Chef.find(req.params.id) 
         
         if(!chef) return res.send('Chef not found')

         const chefRecipes = Chef.findChefRecipes(req.params.id)

         return res.render(`chefs/show`, { chef, chefRecipes })

      } catch (error) {
         console.error(error)   
      }
   },
   async edit(req, res) {
      try {
         
         const chef = await Chef.find(req.params.id)

         return res.render('chefs/edit', { chef })
      
      } catch (error) {
         console.error(error)
      }
   },
   async post(req, res) {
      try {
         
         const chef = await Chef.post(req.body)
            
         return res.redirect(`chefs/${chef.id}`)
      
      } catch (error) {
         console.error(error)   
      }
   },
   async put(req, res) {
      
      await Chef.put(req.body)
      
      return res.redirect(`chefs/${req.body.id}`)

   },
   async delete(req, res) {
      
      await Chef.delete(req.body.id)

      return res.redirect('/chefs')
   }
}