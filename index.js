var Hapi = require('hapi')

var internals = {
  codes : require('./codes')
}

internals.onPreResponse = function (request, reply) {
  if (request.response.isBoom){
    if(request.response.errno >= 19999 
      || request.response.errno === 19) {

      var error = request.response,
          errno = error.errno

      
      var ret = Hapi.error.badRequest(internals.codes[errno])

      ret.output.statusCode = error.errno 
      ret.reformat()
      ret.output.payload.error  = 'Bad Request'
      ret.output.payload.source  = 'LeBrisou-Backend'
      
      return reply(ret)
    } else if(request.response.errno === 500){ 
        error.output.message = internals.codes[500]
    }
  }

  reply()
}

internals.tail = function(request){

}

internals.internalError = function (request, err) {
  // api_server.log(['fatal'], 'Error response (500) sent for request: ' +
  // request.id + ' because: ' + err.message+ ' - '+err.stack)
}

internals.stop = function(){

}


exports.register = function(plugin, options, next){

	plugin.ext('onPreResponse', internals.onPreResponse)
	plugin.events.on('internalError', internals.internalError)

  next()
}

exports.register.attributes = {
  name: 'dictionary-error',
  pkg: require('./package.json')
}