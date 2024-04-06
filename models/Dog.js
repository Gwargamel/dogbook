const mongoose = require('mongoose');

const DogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  description: String,
  present: { type: Boolean, default: false },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dog' }]
});

module.exports = mongoose.model('Dog', DogSchema);
