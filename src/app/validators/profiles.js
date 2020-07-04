const User = require('../models/User')
const { compare } = require('bcryptjs')

module.exports = {
   async put(req, res, next) {
      try {
         const { name, email, password } = req.body
      
         if(name == '' || email == '') {
            return res.render('users/profile', {
               error: 'Todos os campos são obrigatórios',
               user: req.body
            })
         }
   
         const user = await User.findOne({ 
            where: { email }
         })
   
         const validated = await compare(password, user.password)
   
         if(!validated) {
            return res.render('users/profile', {
               error: 'Senha incorreta',
               user: req.body
            })
         }
   
         next()   
      } catch (error) {
         console.error(error)
      }
   }
}