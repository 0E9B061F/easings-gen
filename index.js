'use strict'

const fs = require('fs')
const Mustache = require('mustache')


const extensions = {stylus: 'styl', less: 'less', scss: 'scss'}

const handlers = {
  stylus: ( obj )=> {
    return `${obj.name.padEnd(pad)} = ${obj.css}`
  },

  less: ( obj )=> {
    var name = `${obj.name}:`.padEnd(pad)
    return `@${name} ${obj.css};`
  },

  scss: ( obj )=> {
    var name = `${obj.name}:`.padEnd(pad)
    return `$${name} ${obj.css};`
  }
}

const generate =( data, to )=> {
  var ext = extensions[to]
  var body = data.map(handlers[to]).join("\n")
  var output = Mustache.render(header, {body, ext})
  fs.writeFileSync(`build/easings.${ext}`, output)
}


// Read and prepare input files
var header = fs.readFileSync('templates/easings.mst', 'utf-8')
var data = fs.readFileSync('data/easings.json', 'utf-8')
data = JSON.parse(data)

// Find max name length for prettier printing
var pad = data.map((x)=> { return x.name.length })
pad = Math.max(...pad)

generate(data, 'stylus')
generate(data, 'less')
generate(data, 'scss')
