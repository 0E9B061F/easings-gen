'use strict'

const yaml = require('js-yaml')
const fs = require('fs')


const header = fs.readFileSync('header.txt', 'utf-8')

const decamelize =( s )=> {
  return s.replace(/([A-Z])/g, '-$1').toLowerCase()
}


// Get document, or throw exception on error
try {
  var doc = yaml.safeLoad(fs.readFileSync('easings.yaml', 'utf-8'))
} catch (e) {
  console.log(e)
}

var lengths = Object.values(doc).map((x)=> { return decamelize(x.name).length })
var pad = Math.max(...lengths)

doc = doc.map((o)=> {
  o.name = decamelize(o.name).padEnd(pad)
  return `${o.name} = ${o.css}`
})
doc = doc.join("\n")
doc = `${header}\n\n${doc}\n`

fs.writeFileSync('build/easings.styl', doc)
