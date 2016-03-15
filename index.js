var through = require('through2')
var path = require('path')
var convert = require('convert-source-map')
var SourceNode = require('source-map').SourceNode
var SourceMapConsumer = require('source-map').SourceMapConsumer
var SourceMapGenerator = require('source-map').SourceMapGenerator

var readMap = function(file, code) {
  var map = new SourceMapGenerator();
  map.setSourceContent(file, code);

  code.split('\n').map(function(line, index) {
    map.addMapping({
      source: file,
      original: {
        line: index + 1,
        column: 0
      },
      generated: {
        line: index + 1,
        column: 0
      }
    });
  });

  return map.toJSON()
}

var separator = '\n\n';
var rehead = function(input) {
  var prefix = ';(' + function(load) {
    if (module.hot) {
      module.hot.accept(load)
    }
    load()
  } + ')(function() {';

  var suffix = '});'

  const node = SourceNode.fromStringWithSourceMap(input.code, new SourceMapConsumer(input.map))
  node.prepend(prefix)
  node.add(suffix)
  return node.toStringWithSourceMap(input.map);
}

var transform = function(file) {
  var chunks = []
  return through({
    objectMode: true
  }, function(buffer, encoding, resume) {
    chunks.push(buffer)
    resume()
  }, function(resume) {
    var code = chunks.join('')
    var source = convert.fromSource(code)
    var input =
      ( source
      ? {file: file, map: source.toObject(), code: convert.removeComments(code)}
      : {file: file, map: readMap(file, code), code: code}
      )
    var output = rehead(input)

    this.push(output.code + '\n'
                          + convert.fromJSON(output.map.toString())
                                   .toComment())
    resume()
  })
}
module.exports = function(file, options) {
  var base = options.basedir || process.cwd()
  var isEntry = options._flags.entries.some(function(entry) {
    return path.join(base, entry) === file ||
           path.join(base, entry) + '.js' === file
  })

  return isEntry ? transform(file) : through();
};
