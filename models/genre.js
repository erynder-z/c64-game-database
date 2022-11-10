const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  isLocked: { type: Boolean, required: true },
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
});

// Virtual for genre's URL
GenreSchema.virtual('url').get(function () {
  return `/library/genre/${this._id}`;
});

// Export model
module.exports = mongoose.model('Genre', GenreSchema);
