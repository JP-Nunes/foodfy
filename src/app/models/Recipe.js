const db = require('../../config/db')
const { date } = require('../../lib/utils')

const Base = require('./Base')

Base.init({ table: 'recipes' })

module.exports = {
   ...Base,
   async allRecipesWithChefsNames() {
      try {
         const results = await db.query(`
            SELECT recipes.*, chefs.name as chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ORDER BY recipes.updated_at DESC
            LIMIT 6
         `)

         return results.rows

      } catch (error) {
         console.error(error)
      }
   },
   async findOneWithChefName(id) {
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
   async findChefRecipes(chefId) {
      try {
         const results = await db.query(`
            SELECT title, id 
            FROM recipes
            WHERE chef_id = $1`, [chefId]
         )

         return results.rows
      } catch (error) {
         return console.log(error)      
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
   async post(data) {
      try {
         const query = `
            INSERT INTO recipes (
            
            title, chef_id, ingredients, 
            preparation, information

            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING id
         `
      
         const values = [
            data.title, data.chef_id, data.ingredients, 
            data.preparation, data.information
         ]

         const results = await db.query(query, values)

         return results.rows[0].id
      } catch (error) {
         return console.error(error)
      }
   },
   put(data) {
      const query = `
         UPDATE recipes SET
            title=($1), 
            chef_id=($2), 
            ingredients=($3), 
            preparation=($4), 
            information=($5),
            user_id=($6)
         WHERE id = $7
      `
      
      const values = [
         data.title, 
         data.chef_id, 
         data.ingredients, 
         data.preparation, 
         data.information,
         data.user_id,
         data.id
      ]
   
      return db.query(query, values)
   },
   async paginate(params) {
      try {
         const { limit, offset } = params

         const query = `
            SELECT recipes.*, MAX(recipes.updated_at),
            (SELECT count(*) FROM recipes) AS total, 
            chefs.name as chef_name
            FROM recipes
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
            GROUP BY recipes.id, chefs.name
            ORDER BY recipes.updated_at DESC
            LIMIT $1 OFFSET $2
         `
         const results = await db.query(query, [limit, offset])            

         return results.rows

      } catch (error) {
         console.error(error)
      }
   }
}