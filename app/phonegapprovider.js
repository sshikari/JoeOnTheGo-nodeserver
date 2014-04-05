PhonegapProvider = function(host,port) {
	var client = require('phonegap-build-api');

	client.auth({ username: 'zelda', password: 'tr1f0rce' }, function(e, api) {
	    // time to make requests
	});	
}