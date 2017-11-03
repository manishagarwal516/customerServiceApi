'use strict';
var oauth2orize         = require('oauth2orize'),
	passport            = require('passport'),
	userModel           = require('../models/userModel'),
	aserver             = oauth2orize.createServer(),
	token				= require('./token.js'),
	uuid                = require('node-uuid');

aserver.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done) {
	userModel.getByLoginPass(username, password, function(err, user) {
		if (err) { return done(err); }
		if (!user) { return done(null, false); }
		if (user.length === 0) { return done(null, false); }
		token.newToken('access',user, function(err, accessToken){
			if (err) { return done(err); }
			return done(null, accessToken);
		})
	});
}));

exports.token = [
	passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
	aserver.token(),
	aserver.errorHandler()
];