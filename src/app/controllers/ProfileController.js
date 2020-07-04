const User = require("../models/User")

module.exports = {
   async index(req, res) {
      try {
         const user = await User.findOne({ 
            where: { id: req.session.userId }
         })

         return res.render('users/profile', { user })
      } catch (error) {
         return console.error(error)
      }
   },
   async put(req, res) {
      try {
         const { id, name, email } = req.body
         
         await User.update(id, {
            name: name,
            email: email
         })

         return res.render('users/profile', { 
            user: req.body,
            success: 'Usuário atualizado com sucesso!'    
         })
      } catch (error) {
         console.error(error)
      }
   }
}