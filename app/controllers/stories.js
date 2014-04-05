var mongoose = require('mongoose')
   , async = require('async')
   , Story = mongoose.model('story')
   , _ = require('underscore')

/*
 * GET stories listing.
 */
exports.list = function(req, res){


	Story.list(function(err, story) {		
		if(err != null) {console.log(err)}
		
		// debug
		console.log(story);
		
		res.send(story);
	});

// Hard coded data works
/*
  var myData = 
  {
    "stories": [{"title": "Janvaars of the world", "author": "Salmaan Shikari"}, 
				{"title": "Exotic meats", "author": "Li Qiu"}, 
				{"title": "Day Trading for Dummies", "author": "May Pon"}]
  };
  res.send(myData);
*/

};


