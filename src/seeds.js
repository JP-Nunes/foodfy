const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./app/models/User')
const File = require('./app/models/File')
const Chef = require('./app/models/Chef')
const Recipe = require('./app/models/Recipe')

let usersIds = []
let chefsIds = []

async function createUsers() {
   try {
      const users = []
      const password = await hash('1234', 8)

      while(users.length < 3) {
         users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            is_admin: false
         })
      }

      users.push({
         name: faker.name.firstName(),
         email: faker.internet.email(),
         password,
         is_admin: true
      })

      const usersPromise = users.map(user => {
         return User.create(user)
      })
      usersIds = await Promise.all(usersPromise)
   } catch (error) {
      console.error(error)
   }
}

async function createChefsWithFiles() {
   try {
      const files = []
   
      while(files.length < 4) {
         files.push({
            name: faker.image.image(),
            path: `public/images/placeholder.png`,
         })
      }
      
      const filesPromise = files.map(file => {
         return File.create(file)
      })
      const filesIds = await Promise.all(filesPromise)
      
      const chefsPromise = filesIds.map(id => {
         return Chef.create({
            name: faker.name.firstName(),
            file_id: id,
         })
      })
      chefsIds = await Promise.all(chefsPromise)
   } catch (error) {
      console.error(error)
   }
}

async function createRecipesWithFiles() {
   try {
      const files = []
      const recipes = []

      while(files.length < 30) {
         files.push({
            name: faker.image.image(),
            path: `public/images/placeholder.png`,
         })
      }

      const filesPromise = files.map(file => {
         return File.create(file)
      })
      const filesIds = await Promise.all(filesPromise)

      while(recipes.length < 10) {
         recipes.push({
            chef_id: chefsIds[Math.floor(Math.random() * 4)],
            user_id: usersIds[Math.floor(Math.random() * 3)],
            title: faker.name.title(),
            ingredients: [faker.lorem.paragraph(1)],
            preparation: [
               faker.lorem.paragraph(1), 
               faker.lorem.paragraph(1)
            ],
            information: faker.lorem.paragraph(Math.ceil(Math.random() * 8))
         })
      }
      
      const recipesPromise = recipes.map(recipe => {
         return Recipe.post(recipe)
      })
      const recipesIds = await Promise.all(recipesPromise)
      
      let counter = 0
      
      const recipeFilesPromise = filesIds.map(fileId => {
         File.postRecipeFiles({
            recipe_id: recipesIds[counter],
            file_id: fileId
         })

         counter++
         
         if(counter >= recipesIds.length) {
            counter = 0
         }
      })
      await Promise.all(recipeFilesPromise)
   } catch (error) {
      console.error(error)
   }
}

async function init() {
   await createUsers()
   await createChefsWithFiles()
   await createRecipesWithFiles()
}

init()