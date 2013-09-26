BASE_DIR = __dirname;

var express = require('express'),
  http      = require('http'),
  path      = require('path'),
  _         = require('underscore'),
  avalanche = require('avalanche'),
  api				= require( BASE_DIR + '/util/api' ),

  // App stuff
  app = module.exports = express(),
  env = app.get('env'),

  // Define downstream vars
  auth, mobile, helper, pageMiddleware;

app.set( 'port', process.env.PORT || process.env.VCAP_APP_PORT || 8125 );
app.use(express.cookieParser());
app.use(express.session({ secret: 'whatabloodygreatdaytogosailing'}));

app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'hogan' );
app.engine( 'hogan', require('hogan-express') );

auth    = require( BASE_DIR + '/util/auth');
mobile  = require( BASE_DIR + '/util/mobile');
helper  = require( BASE_DIR + '/util/helper' );
session = require( BASE_DIR + '/util/session' );

//TODO
avalanche.read(path.join(BASE_DIR,'views'));

setInterval(function(){
  avalanche.read(path.join(BASE_DIR,'views'));
},15000);

pageMiddleware = [

  auth.checkSessionStatus,
  mobile.setupMobile,
  helper.parseRoute,
  session.checkSession,
  helper.createPage

];
app.get('/', pageMiddleware );
app.get('/home', pageMiddleware );
app.get('/application', pageMiddleware );
app.get('/era/:era', pageMiddleware );


http.createServer( app ).listen( app.get('port'), function() {

  console.log( 'Express server ready to chit-chat on port ' + app.get('port') );

});


//TODO


 //setup wookmark for gallery creation

 //figure out image uploading for node.js
