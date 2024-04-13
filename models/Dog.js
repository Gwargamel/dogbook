// Importerar mongoose-paketet för att interagera med MongoDB
import mongoose from 'mongoose';

// Schema för 'Dog' som definierar strukturen för 'Dog'-dokument i databasen
const DogSchema = new mongoose.Schema({
  // Obligatoriska fält för hundarnas namn, ålder och beskrivning
  name: { type: String, required: true },
  age: { type: Number, required: true },
  description: String,
  // Ett booleskt fält som automatiskt kommer att sättas till 'false' om det inget annat anges
  present: { type: Boolean, default: false },
  // En array för att skapa relationer mellan olika 'Dog'-dokument.
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dog' }]
});

export default mongoose.model('Dog', DogSchema);
