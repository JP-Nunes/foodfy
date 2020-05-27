const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
   all(callback) {
      db.query(`
      SELECT recipes.*, chefs.name as chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      `, (error, results) => {
         if(error) return console.log(error)

         callback(results.rows)
      })
   },
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
   filtered(filter, callback) {
      db.query(`
      SELECT recipes.*, chefs.name as chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.title ILIKE '%${filter}%'
      GROUP BY chefs.name, recipes.id
      ORDER BY recipes.title ASC
      `, (error, results) => {
         if(error) return console.log(error)
         
         callback(results.rows)
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
   },
   put(data, callback) {
      const query = `
         UPDATE recipes SET

            image=($1), title=($2), chef_id=($3), 
            ingredients=($4), preparation=($5), information=($6)

         WHERE id = $7
      `

      const values = [
         data.image, data.title, data.chef_id, data.ingredients, 
         data.preparation, data.information, data.id
      ]
      
      db.query(query, values, (error) => {
         if(error) return console.log(error)

         callback()
      })
   },
   delete(id, callback) {
      db.query(`DELETE FROM recipes WHERE id = $1`, [id], (error) => {
         if(error) return console.log(error)

         callback()
      })
   }
}