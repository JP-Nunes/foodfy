const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
   all(callback) {
      db.query(`SELECT * FROM chefs ORDER BY name ASC`, (error, results) => {
         if(error) return results.send('Database Error!')

         callback(results.rows)
      })
   },
   find(id, callback) {
      db.query(`
         SELECT chefs.*, count(recipes) AS total_recipes 
         FROM chefs
         LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
         WHERE chefs.id = $1
         GROUP BY chefs.id`, [id], (error, results) => {
         if(error) return console.log(error)
         
         callback(results.rows[0])
      })
   },
   findChefRecipes(id, callback) {
      db.query(`
         SELECT image, title, id FROM recipes
         WHERE chef_id = $1`, [id], (error, results) => {
            if(error) return console.log(error)

            callback(results.rows)
         })
   },
   post(data, callback) {
      const query = `
         INSERT INTO chefs (
            name, image, created_at
         ) VALUES ($1, $2, $3)
         RETURNING id
      `

      const values = [
         data.name, data.image, date(Date.now()).iso
      ]

      db.query(query, values, (error, results) => {
         if(error) return res.send('Database Error!')

         callback(results.rows[0])
      })
   },
   put(data, callback) {
      const query = `
         UPDATE chefs SET name=($1), image=($2)
         WHERE id = $3
      `
      const values = [
         data.name, data.image, data.id
      ]
      
      db.query(query, values, (error) => {
         if(error) return console.log(error)

         callback()
      })
   },
   delete(id, callback) {
      db.query(`DELETE FROM chefs WHERE id = $1`, [id], (error) => {
         if(error) return console.log(error)

         callback()
      })
   }
}