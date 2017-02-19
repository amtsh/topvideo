exports.formatForResponse = function (key, textBlob) {
  textBlob = textBlob.replace(/'/g, '"')
  textBlob = '[' + textBlob + ']'
  var items = JSON.parse(textBlob)
  var response = {'items': ''}

  switch (key) {
    case 'i18nRegions':
      response.items = resFormatter(items, ['id', 'snippet.name'])
      break
    case 'videoCategories':
      response.items = resFormatter(items, ['id', 'snippet.title'])
      break
    case 'trending':
      response['nextPageToken'] = items[0]['nextPageToken'] || ''
      items.shift()
      response.items = resFormatter(items, ['id', 'snippet.thumbnails.high.url'])
      break
  }
  return response
}

exports.formatToSave = function (items, saveTo, nextPageToken) {
  switch (saveTo) {
    case 'i18nRegions':
      return saveFormatter(items, ['id', 'snippet.name'])
    case 'videoCategories':
      return saveFormatter(items, ['id', 'snippet.title'])
    case 'trending':
      return saveFormatter(items, ['id', 'snippet.thumbnails.high.url'], nextPageToken)
  }
}

function resFormatter (items, fields) {
  var response = []

  var att0 = fields[0]
  var att1 = fields[1]

  var item = {}
  var len = items.length

  for (var i = 0; i < len; i++) {
    item = items[i]

    var obj = prepareObject(att1, item[att1])
    obj[att0] = item[att0]
    response.push(obj)

    if (i === len - 1) {
      return response
    }
  }
}

function saveFormatter (items, fields, nextPageToken) {
  var textBlob = ''
  if (nextPageToken) {
    textBlob += JSON.stringify({'nextPageToken': nextPageToken}) + ','
  }

  var att0 = fields[0]
  var att1 = fields[1]

  var item = {}
  var obj = {}
  var len = items.length

  for (var i = 0; i < len; i++) {
    item = items[i]

    obj[att0] = item[att0]
    obj[att1] = getValue(item, att1)
    textBlob += JSON.stringify(obj) + ','

    if (i === len - 1) {
      textBlob = textBlob.replace(/"/g, "'")
      textBlob = textBlob.slice(0, -1)
      return textBlob
    }
  }
}

// get value of the property given in keysPath
function getValue (obj, keysPath) {
  var keys = keysPath.split('.')
  var key
  while (keys.length > 0) {
    key = keys.shift()
    obj = obj[key]
  }
  return obj
}

// prepare nested object with keyString as keys and value as property of deepest key
function prepareObject (keyString, value) {
  var keys = keyString.split('.')

  while (keys.length > 0) {
    var obj = {}
    obj[keys.pop()] = value
    value = obj
  }
  return value
}
