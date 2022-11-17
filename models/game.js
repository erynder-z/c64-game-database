const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  isLocked: { type: Boolean, required: true },
  title: { type: String, required: true },
  publisher: { type: Schema.Types.ObjectId, ref: 'Publisher', required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
  year: { type: Number },
  summary: { type: String },
  played_it: { type: Number, default: 0 },
  liked_it: { type: Number, default: 0 },
  img: {
    data: Buffer,
    contentType: String,
  },
});

// Virtual for game's URL
GameSchema.virtual('url').get(function () {
  return `/library/game/${this._id}`;
});

// Export model
module.exports = mongoose.model('Game', GameSchema);
