'use strict'

const Generator = require('./scripts/generator.js')


const gen = new Generator()

// Define output formats

gen.handler('stylus', ( obj )=> {
  return `${obj.name.padEnd(gen.pad)} = ${obj.css}`
}, 'styl')

gen.handler('less', ( obj )=> {
  var name = `${obj.name}:`.padEnd(gen.pad+1)
  return `@${name} ${obj.css};`
})

gen.handler('scss', ( obj )=> {
  var name = `${obj.name}:`.padEnd(gen.pad+1)
  return `$${name} ${obj.css};`
})

gen.generate_each()
gen.readme()
