const api = require('../endpoints.json')

exports.getAllEndpoints = (req, res, next) => {
  res.status(200).send(api)
}
