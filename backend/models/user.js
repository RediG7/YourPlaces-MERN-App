const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  // unique: true -> creates an index for the email so it speeds up the query
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  // multiple places entry [{}]
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
});

// query as fast as possible, and make sure we can only create a new user if the email doesn't exist already
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
