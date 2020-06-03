const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
   async all() {
      try {
         
         const results = await db.query(`
            SELECT recipes.*, chefs.name as chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
         `)

         return results.rows

      } catch (error) {
         console.error(error)
      }
   },
   async find(id) {
      try {
         
         const results = await db.query(`
            SELECT recipes.*, chefs.name as chef_name 
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id) 
            WHERE recipes.id = $1`, [id]
         )

         return results.rows[0]

      } catch (error) {
         return console.error(error)
      }
   },
   async filtered(filter) {
      try {

         const results = await db.query(`
            SELECT recipes.*, chefs.name as chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.title ILIKE '%${filter}%'
            GROUP BY chefs.name, recipes.id
            ORDER BY recipes.title ASC  
         `)
            
         return results.rows

      } catch (error) {
         return console.error(error)
      }      
   },
   async nameAndId() {
      try {

         const results = await db.query(`SELECT name, id FROM chefs`)
         
         return results.rows

      } catch (error) {
         return console.error(error)
      }
   },
   async post(data) {
      try {

         const query = `
            INSERT INTO recipes (
            
            title, chef_id, ingredients, 
            preparation, information, created_at

            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
         `
      
         const values = [
            data.title, data.chef_id, data.ingredients, 
            data.preparation, data.information, date(Date.now()).iso
         ]

         const results = await db.query(query, values)

         return results.rows[0]
         
      } catch (error) {
         return console.error(error)
      }
   },
   put(data) {
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
   
      return db.query(query, values)
   },
   delete(id, callback) {
      
      return db.query(`DELETE FROM recipes WHERE id = $1`)

   },
   async paginate(params, callback) {
      try {
         const { limit, offset } = params

         const query = `
            SELECT recipes.*, (SELECT count(*) FROM recipes) AS total, 
            chefs.name as chef_name
            FROM recipes
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
            GROUP BY recipes.id, chefs.name
            LIMIT $1 OFFSET $2
         `
         const results = await db.query(query, [limit, offset])            

         return results.rows

      } catch (error) {
         console.error(error)
      }
   }
}