const db = require('../../config/db')
const fs = require('fs')

module.exports ={
   async allRecipeFiles(id) {
      try {
         
         const results = await db.query(`
            SELECT files.* 
            FROM files
            LEFT JOIN recipe_files ON (recipe_files.file_id = files.id) 
            WHERE recipe_files.recipe_id = $1`, [id]
         )

         return results.rows
         
      } catch (error) {
         return console.error(error)
      }
   },
   async post(data, recipeId) {
      try {

         const query = `
            INSERT INTO files (name, path) 
            VALUES ($1, $2)
            RETURNING id
         `
         const values = [data.filename, data.path]

         const results = await db.query(query, values)

         return results.rows

      } catch (error) {
         return console.error(error)
      }
   },
   postRecipeFiles(data) {
      try {

         const query = `
            INSERT INTO recipe_files (recipe_id, file_id) 
            VALUES ($1, $2)
            RETURNING id
         `
         const values = [data.recipe_id, data.file_id]

         return db.query(query, values)
         
      } catch (error) {
         return console.error(error)
      }
   },
   async delete(id) {
      
      try {
         
         const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
         const file = result.rows[0]

         fs.unlinkSync(file.path)

         return db.query(`DELETE FROM files WHERE id = $1`, [id])
           
      } catch (error) {
         console.error(error)
      }
   }
}