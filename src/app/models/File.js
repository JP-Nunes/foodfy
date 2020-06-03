const db = require('../../config/db')

module.exports ={
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
}