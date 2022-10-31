const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PublisherSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  founded: { type: Number },
  defunct: { type: Number },
});

// Virtual for author's URL
PublisherSchema.virtual('url').get(function () {
  return `/library/publisher/${this._id}`;
});

// Export model
module.exports = mongoose.model('Publisher', PublisherSchema);
