var _     = require('underscore'),
  app     = require( BASE_DIR + '/app' ),
  moment  = require('moment'),
  fs      = require('fs');
  avalanche = require( 'avalanche' );

exports.checkSession = function ( req, res, next ){

  var obj = {
    route: req.route.params[0],
    query: req.query
  }

  next();

};