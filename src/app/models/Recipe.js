const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
   find(id, callback) {
      db.query(`
         SELECT recipes.*, chefs.name as chef_name 
         FROM recipes
         LEFT JOIN chefs ON (recipes.chef_id = chefs.id) 
         WHERE recipes.id = $1`, [id], (error, results) => {
         
         if(error) return console.log(error)

         callback(results.rows[0])
      })
   },
   nameAndId(callback) {
      db.query(`SELECT name, id FROM chefs`, (error, results) => {
         if(error) return results.send('Database Error')

         callback(results.rows)
      })
   },
   post(data, callback) {
      const query = `
      INSERT INTO recipes (
         
         image, title, chef_id, ingredients, 
         preparation, information, created_at

         ) VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id
      `
      
      const values = [
         data.image, data.title, data.chef_id, data.ingredients, 
         data.preparation, data.information, date(Date.now()).iso
      ]

      db.query(query, values, (error, results) => {
         if(error) return console.log(`Database error ${error}`)

         callback(results.rows[0])
      })
   }
}