var flatten = require('flat')
var unflatten = require('flat').unflatten

function flattenObject (object) {
  return flatten(object)
}

function unflattenObject (object) {
  return unflatten(object)
}

module.exports = {
  flattenObject: flattenObject,
  unflattenObject: unflattenObject
}
