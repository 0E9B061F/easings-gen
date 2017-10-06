'use strict'

const yaml = require('js-yaml')
const fs = require('fs')


const decamelize =( s )=> {
  return s.replace(/([A-Z])/g, '-$1').toLowerCase()
}


// Get document, or throw exception on error
try {
  var doc = yaml.safeLoad(fs.readFileSync('data/easings.yaml', 'utf-8'))
} catch (e) { console.log(e) }

doc = Object.values(doc).map((o)=> {
  return {name: decamelize(o.name), css: o.css}
})

fs.writeFileSync('data/easings.json', JSON.stringify(doc))
