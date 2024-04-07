//Dog.js
import mongoose from 'mongoose';

const DogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  description: String,
  present: { type: Boolean, default: false },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dog' }]
});

export default mongoose.model('Dog', DogSchema);
