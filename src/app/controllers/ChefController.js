const Chef = require('../models/Chef')

module.exports = {
   index(req, res) {
      return res.send('To be implemented')
   },
   create(req, res) {
      return res.render('chefs/create')
   },
   show(req, res) {
      return res.render('chefs/show')
   },
   edit(req, res) {
      return res.send('To be implemented')
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
      return res.send('To be implemented')
   },
   delete(req, res) {
      return res.send('To be implemented')
   }
}