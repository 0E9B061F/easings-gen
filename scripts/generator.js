'use strict'

const fs = require('fs')
const Mustache = require('mustache')


// Store function to transform source data from JSON to the required format,
// as well as information about that format
class Handler {
  constructor (prep, block, ext = null) {
    this.prep = prep
    this.ext = ext || prep
    this.block = block
  }
}

class Generator {
  constructor () {
    // Read and prepare input files
    this.library_mst = fs.readFileSync('templates/easings.mst', 'utf-8')
    this.readme_mst = fs.readFileSync('templates/README.mst', 'utf-8')
    this.data = fs.readFileSync('data/easings.json', 'utf-8')
    this.data = JSON.parse(this.data)
    // Find max name length for prettier printing
    this.pad = this.data.map((x)=> { return x.name.length })
    this.pad = Math.max(...this.pad)
    // Information about handlers
    this.index = {}
    this.formats = []
  }

  // Define an output format handler
  handler (prep, block, ext = null) {
    var h = new Handler(prep, block, ext)
    this.index[prep] = h
    this.formats.push(prep)
    return h
  }

  // Coerce the data to the given format
  generate (format) {
    var h = this.index[format]
    var body = this.data.map(h.block).join("\n")
    var output = Mustache.render(this.library_mst, {body, ext: h.ext})
    fs.writeFileSync(`build/easings.${h.ext}`, output)
  }

  // Generate the README file
  readme () {
    var output = Mustache.render(this.readme_mst, {
      count: this.data.length,
      easings: this.data
    })
    fs.writeFileSync('README.md', output)
  }

  // Generate each output type
  generate_each () {
    for (var i = 0; i < this.formats.length; i++) {
      this.generate(this.formats[i])
    }
  }
}


module.exports = Generator
