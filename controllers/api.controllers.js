/* const api = require('../endpoints.json')

exports.getApi = (req, res, next) => {
  res.status(200).send(api)
}
 */

const path = require('path')

exports.getAllEndpoints = (req, res, next) => {
  res.sendFile('endpoints.json', { root: path.join(__dirname, '../') })
}
