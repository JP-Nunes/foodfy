const User = require("../models/User")

module.exports = {
   index(req, res) {
      try {

         //const user = await findOne()

         return res.render('users/profile')
         
      } catch (error) {
         return console.error(error)
      }
   },
   async put(req, res) {
      try {
         
         await User.updateProfile(req.body)

         return res.redirect('users/users/profile')

      } catch (error) {
         console.error(error)
      }
   }
}