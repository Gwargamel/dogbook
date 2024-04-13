// Importerar nödvändiga moduler
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Importerar hundmodellen från angiven fil
import Dog from '../models/Dog.js'; 

// Skapar en Express-app
const app = express();

// Middleware för att tillåta CORS (Cross-Origin Resource Sharing)
app.use(cors());
// Middleware för att tolka JSON i förfrågningar
app.use(express.json());

// Ansluter till MongoDB-databasen 'dogbook' som körs lokalt
mongoose.connect('mongodb://localhost:27017/dogbook')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Endpoint för att hämta alla hundar
app.get('/api/dogs', async (req, res) => {
  try {
    const dogs = await Dog.find();
    res.json(dogs);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Endpoint (GET) för att hämta en specifik hund baserat på dess ID
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

// Endpoint (POST) som hanterar vänrelationer direkt vid skapandet av en ny hund
app.post('/api/dogs', async (req, res) => {
  try {
    const newDog = new Dog(req.body);
    await newDog.save();
// Loopar igenom listan av vänner och uppdaterar deras 'friends' array
    const friendUpdates = newDog.friends.map(async (friendId) => {
      const friendDog = await Dog.findById(friendId);
      if (friendDog && !friendDog.friends.includes(newDog._id)) {
        friendDog.friends.push(newDog._id);
        await friendDog.save();
      }
    });

    await Promise.all(friendUpdates);
    res.status(201).json(newDog);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Endpoint (PUT) som hanterar vänrelationer mellan hundarna
app.put('/api/dogs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const dogToUpdate = await Dog.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!dogToUpdate) {
      return res.status(404).send('Dog not found.');
    }

    // Uppdaterar vänrelationer för befintlig hund
    const friendUpdates = dogToUpdate.friends.map(async (friendId) => {
      const friendDog = await Dog.findById(friendId);
      if (friendDog && !friendDog.friends.includes(id)) {
        friendDog.friends.push(id);
        return friendDog.save();
      }
    });

    await Promise.all(friendUpdates);
    res.json(dogToUpdate);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Endpoint (DELETE) för att ta bort en befintlig hund
app.delete('/api/dogs/:id', async (req, res) => {
  try {
    const dog = await Dog.findByIdAndDelete(req.params.id);
    if (!dog) {
      return res.status(404).send('Dog not found.');
    }
    res.status(200).send('Dog deleted.');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Endpoint (POST) för att hämta flera hundar via en lista av ID:n
app.post('/api/dogs/batch', async (req, res) => {
  try {
    const dogs = await Dog.find({ '_id': { $in: req.body.ids } });
    res.json(dogs);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Startar servern på porten som angivits i miljövariabeln PORT, eller 5000 som standard
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
