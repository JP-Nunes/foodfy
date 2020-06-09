const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
   async all() {
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
   async find(id) {
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
   async findChefRecipes(id) {
      try {

         const results = await db.query(`
            SELECT title, id 
            FROM recipes
            WHERE chef_id = $1`, [id]
         )

         return results.rows
         
      } catch (error) {
         return console.log(error)      
      }
   },
   async post(data, file_id) {
      try {
         
         const query = `
            INSERT INTO chefs (
               name, created_at, file_id
            ) VALUES ($1, $2, $3)
            RETURNING id
         `

         const values = [
            data.name, date(Date.now()).iso, file_id
         ]

         const results = await db.query(query, values)

         return results.rows[0]

      } catch (error) {
         return console.error('Database Error!')
      }
   },
   put(data) {

      const query = `
         UPDATE chefs 
         SET name=($1)
         WHERE id = $2
      `
      const values = [
         data.name, data.id
      ]
      
      return db.query(query, values)

   },
   delete(id) {
      return db.query(`DELETE FROM chefs WHERE id = $1`, [id])
   }
}