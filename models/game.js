const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  title: { type: String, required: true },
  publisher: { type: Schema.Types.ObjectId, ref: 'Publisher', required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
  year: { type: Number },
  summary: { type: String },
  imageURL: { type: String },
  played_it: { type: Number, default: 0 },
  liked_it: { type: Number, default: 0 },
});

// Virtual for book's URL
GameSchema.virtual('url').get(function () {
  return `/library/game/${this._id}`;
});

// Export model
module.exports = mongoose.model('Game', GameSchema);
