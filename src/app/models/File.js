const db = require('../../config/db')

const Base = require('./Base')

Base.init({ table: 'files' })

module.exports ={
   ...Base,   
   async allRecipeFiles(id) {
      try {
         const results = await db.query(`
            SELECT files.*, recipe_files.recipe_id as recipe_id 
            FROM files
            LEFT JOIN recipe_files ON (recipe_files.file_id = files.id) 
            WHERE recipe_files.recipe_id = $1`, [id]
         )

         return results.rows

      } catch (error) {
         return console.error(error)
      }
   },
   postRecipeFiles(data) {
      const { recipe_id, file_id } = data
      
      try {
         const query = `
            INSERT INTO recipe_files (recipe_id, file_id) 
            VALUES ($1, $2)
            RETURNING id
         `
         const values = [recipe_id, file_id]

         return db.query(query, values)
      } catch (error) {
         return console.error(error)
      }
   },
}