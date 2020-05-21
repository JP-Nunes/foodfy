const fs = require('fs')

const data = require('../../data')
const dataJson = require('../../../data.json')

module.exports = {
   index(req, res) {
      return res.send('To be implemented')
   },
   create(req, res) {
      return res.render('chefs/create')
   },
   show(req, res) {
      return res.send('To be implemented')
   },
   edit(req, res) {
      return res.send('To be implemented')
   },
   post(req, res) {
      return res.send('To be implemented')
   },
   put(req, res) {
      return res.send('To be implemented')
   },
   delete(req, res) {
      return res.send('To be implemented')
   }
}