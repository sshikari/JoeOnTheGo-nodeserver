var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

// Define the schema
var ObjectId = Schema.ObjectId
var StorySchema = new Schema({
	story: 
		{
			_id:ObjectId,
			title:String,
			author:String
		}
});


StorySchema.statics = {
		
    /*
	* Get all of the stories
	*/
	list: function(callback) {

		//console.log(this.collection)
		
		// Query the mongodb database and send the results to the callback function
		this.find().exec(callback)
	}
}

// Register the model, make sure to specify the 3rd argument which forces the collection name
mongoose.model('story', StorySchema, 'story');
