const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
   host: "smtp.mailtrap.io",
   port: 2525,
   auth: {
      user: "624739f6e5fb0a",
      pass: "54e83c9c82f11f"
   }
})
