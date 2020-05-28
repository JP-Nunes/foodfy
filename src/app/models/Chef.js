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
         
         const results = db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes 
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            WHERE chefs.id = $1
            GROUP BY chefs.id`, [id]
         )
         
         return results.rows[0]

      } catch (error) {
         if(error) return console.log(error)
      }
   },
   async findChefRecipes(id) {
      try {

         const results = await db.query(`
            SELECT image, title, id FROM recipes
            WHERE chef_id = $1`, [id]
         )  

         return results.rows
         
      } catch (error) {
         if(error) return console.log(error)      
      }
   },
   async post(data) {
      try {
         
         const query = `
            INSERT INTO chefs (
               name, image, created_at
            ) VALUES ($1, $2, $3)
            RETURNING id
         `

         const values = [
            data.name, data.image, date(Date.now()).iso
         ]

         const results = await db.query(query, values)

         return results.rows[0]

      } catch (error) {
         if(error) return res.send('Database Error!')
      }
   },
   put(data) {

      const query = `
      UPDATE chefs SET name=($1), image=($2)
      WHERE id = $3
      `
      const values = [
         data.name, data.image, data.id
      ]
      
      return db.query(query, values)

   },
   delete(id, callback) {
      return db.query(`DELETE FROM chefs WHERE id = $1`, [id])
   }
}