const db = require('../../config/db')
const { date } = require('../../lib/utils')

const Base = require('./Base')

Base.init({ table: 'chefs' })

module.exports = {
   ...Base,
   async findAllAndCountRecipes() {
      try {
         
         const results = await db.query(`
            SELECT chefs.*, count(recipes) as total_recipes 
            FROM chefs 
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            GROUP BY chefs.id
            ORDER BY name ASC
         `)

         return results.rows
         
      } catch (error) {
         return console.error(error)
      }
   },
   async findOneAndCountRecipes(id) {
      try {  
         const results = await db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes 
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            WHERE chefs.id = $1
            GROUP BY chefs.id`, [id]
         )
         
         return results.rows[0]
      } catch (error) {
         return console.log(error)
      }
   },
   async nameAndId() {
      try {
         const results = await db.query(`SELECT name, id FROM chefs`)
         
         return results.rows
      } catch (error) {
         return console.error(error)
      }
   }
}