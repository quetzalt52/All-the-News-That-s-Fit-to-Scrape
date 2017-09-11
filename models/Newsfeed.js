//https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose

// require mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// new Schema
var NewsfeedSchema = Schema({
	title: {
		type: String,
		required: true,
		unique: true // make sure the article is not repeated again
	},
	summary: {
		type: String,
		required: true
	},
	articleURL: {
		type: String,
		required: true
	},
	imgURL: {
		type: String,
		required: true
	},
//save the object id 
feeds: {
  type: Schema.Types.ObjectId,
  ref: "New Feed"
  }
  
});

// use the above schema to make the scrapedData model
var Newsfeed = mongoose.model("Newsfeed", NewsfeedSchema);

// export the model so the server can use it
module.exports = Newsfeed;
