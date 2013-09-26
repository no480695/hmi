var _        = require('underscore'),
  app = require( BASE_DIR + '/app' ),
  moment = require('moment'),
  user = require('../mappings/user.json'),
  email = require('emailjs/email'),
  server = email.server.connect({
  	user: user.username,
  	password: user.password,
  	host: 'smtp.gmail.com',
  	ssl: true
  });

exports.getInput = function( req, res, next ) {

  next();

}

exports.sendEmail = function( req, res, next ){

	server.send({
		text: "hello",
		from: 'Nathan <no480695@gmail.com>',
		to: 'Nathan <no480695@gmail.com>',
		subject: 'testing emailjs'
	}, function( err, message ){

		res.send( err || message );
		
	});

}