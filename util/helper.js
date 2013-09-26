var _        = require('underscore'),
  app = require( BASE_DIR + '/app' ),
  moment = require('moment'),
  fs = require('fs');

exports.parseRoute = function( req, res, next ) {

  //res.locals.fullPathArray = req.route.params[0].split('/').shift();

  var path = req.route.path.replace(/\//g, '*');

  var path_array = path.split("*");
  path_array.shift();

  if ( req.route.path != '/' ){
    res.locals.fullPathArray = path_array;
  }
  else{
    res.locals.fullPathArray = ['home'];
  }

  res.locals.pageSettings = {
    era : req.params.era
  }

  next();

}

exports.createPage = function( req, res, next ){

  console.log(req.session);

  require( BASE_DIR + '/routes/index' ).main( req, res );

}


