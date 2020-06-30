const db = require('../../config/db')

module.exports = {
   async all() {
      try {
         
         const results = await db.query(`SELECT * FROM users`)

         return results.rows

      } catch (error) {
         console.error(error)
      }
   },
   async findOne(filters) {
      try {

         let query = `SELECT * FROM users`

         Object.keys(filters).map(key => {
            query = `
            ${query}
            ${key}
            `
            Object.keys(filters[key]).map(field => {
               query = `${query} ${field} = '${filters[key][field]}'`
            })
         })
         
         const results = await db.query(query)

         return results.rows[0]

      } catch (error) {
         console.error(error)
      }
   },
   async create(data) {
      try {

         const query = `
            INSERT INTO users (
               name, 
               email, 
               password,
               is_admin
            ) VALUES ($1, $2, $3, $4)
            RETURNING id
         `
         
         const values = [
            data.name,
            data.email,
            data.password,
            data.is_admin
         ]
         
         const results = await db.query(query, values)

         return results.rows[0]

      } catch (error) {
         console.error(error)
      }
   },
   update(data) {
      try {

         const query = `
            UPDATE users SET
               name=($1), 
               email=($2),
               password=($3), 
               is_admin=($4),
               reset_token=($5),
               reset_token_expires=($6)
            WHERE id = $7
         `
         
         const values = [
            data.name,
            data.email,
            data.password,
            data.is_admin,
            data.token,
            data.token_expires,
            data.id
         ]

         return db.query(query, values)

      } catch (error) {
         console.error(error)
      }
   },
   async updateProfile(data) {
      try {

         const query = `
            UPDATE users SET (
               name, 
               email, 
            ) VALUES ($1, $2, $3)
            WHERE id = $4
         `
         
         const values = [
            data.name,
            data.email,
         ]

         const results = await db.query(query, values)

         return results.rows[0]

      } catch (error) {
         console.error(error)
      }
   },
   delete(id) {
      return db.query(`DELETE FROM users WHERE id=($1)`, [id])
   }
}