//server.js

// Importera express och mongoose
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Importera Dog-modellen
import Dog from '../models/Dog.js'; // Använd den korrekta sökvägen

// Skapa en ny Express-applikation
const app = express();

// Aktivera CORS för alla förfrågningar
app.use(cors());

// Middleware för att tolka JSON i inkommande förfrågningar
app.use(express.json());

// Anslut till MongoDB-databasen
mongoose.connect('mongodb://localhost:27017/dogbook')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// GET-route för att hämta alla hundar
app.get('/api/dogs', async (req, res) => {
  try {
    const dogs = await Dog.find();
    res.json(dogs);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// GET-route för att hämta en specifik hund baserat på ID
app.get('/api/dogs/:id', async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);
    if (!dog) {
      return res.status(404).send('Dog not found');
    }
    res.json(dog);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// POST-route för att skapa en ny hund
app.post('/api/dogs', async (req, res) => {
  try {
    const dog = new Dog(req.body);
    await dog.save();
    res.status(201).json(dog);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// PUT-route för att uppdatera en befintlig hund
app.put('/api/dogs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const dog = await Dog.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!dog) {
      return res.status(404).send('Dog not found.');
    }
    res.json(dog);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Definiera en port för servern att lyssna på
const PORT = process.env.PORT || 5000; // Använd PORT från miljövariabler om den finns

// Starta servern och lyssna på den angivna porten
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
