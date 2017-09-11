//https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose

// require mongoose
var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

// new Schema
var scrapedDataSchema = Schema({
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
	}
});

// use the abvoe schema to make the scrapedData model
var scrapedData = mongoose.model('scrapedData', scrapedDataSchema);

// export the model so the server can use it
module.exports = scrapedData;
