// Require mongoose
var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

// Create the Note schema
var HeadlinesSchema = new Schema({
  // Just a string
  title: {
    type: String
  },
  // Just a string
  body: {
    type: String
  }
});

var Headlines = mongoose.model("Headlines", HeadlinesSchema);

// Export the Headlines model
module.exports = Headlines;