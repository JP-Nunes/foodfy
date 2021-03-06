const ChefLoader = require('../services/LoadChefsService')

module.exports = {
   async show(req, res, next) {
      try {
         const { chef, chefImage } = 
            await ChefLoader.loadChef({ where: 
               { id: req.params.id}
            })
   
         if(!chef) {
            return res.render('chefs/index', {
               error: 'Usuário não encontrado'
            })
         }
   
         req.chef = chef
         req.chefImage = chefImage
   
         next()
      } catch (error) {
         console.error(error)
      }  
   },
   post(req, res, next) {
      if(req.body.name == "") {
         return res.render('chefs/create', {
            error: 'Preencha o nome do Usuário',
            chef: req.body
         })
      }

      if(!req.file) {
         return res.render('chefs/create', {
            error: 'É necessário ao menos uma imagem.',
            chef: req.body
         })
      }

      next()
   },
   put(req, res, next) {
      if(req.body.name == "") {
         return res.render('chefs/edit', {
            error: 'Preencha o nome do Usuário',
            chef: req.body
         })
      }

      next()
   }
}