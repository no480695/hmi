var _        = require('underscore'),
  app = require( BASE_DIR + '/app' ),
  moment = require('moment');

exports.checkSessionStatus = function( req, res, next ) {

  req.session.loggedIn = true;

  next();

}