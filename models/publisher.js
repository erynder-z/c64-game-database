const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PublisherSchema = new Schema({
  isLocked: { type: Boolean, required: true },
  name: { type: String, required: true, maxLength: 100 },
  founded: { type: Number },
  defunct: { type: Number },
});

// Virtual for publisher's URL
PublisherSchema.virtual('url').get(function () {
  return `/library/publisher/${this._id}`;
});

// Virtual to get the company lifespan
PublisherSchema.virtual('company_lifespan').get(function () {
  const lifeSpanString = `(${this.founded} -  ${this.defunct})`;

  if (this.founded && this.defunct) {
    return lifeSpanString;
  }

  if (this.founded && !this.defunct) {
    return ` (${this.founded}  - today)`;
  }

  if (!this.founded && !this.defunct) {
    return;
  }
});

// Export model
module.exports = mongoose.model('Publisher', PublisherSchema);
