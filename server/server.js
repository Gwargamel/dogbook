// Importera express och mongoose
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Importera Dog-modellen
import Dog from '../models/Dog.js'; // Anpassa sökvägen efter din projektstruktur

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/dogbook')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));


app.get('/api/dogs', async (req, res) => {
  try {
    const dogs = await Dog.find();
    res.json(dogs);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

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

// Uppdaterad POST-route som hanterar vänrelationer direkt vid skapandet av en ny hund
app.post('/api/dogs', async (req, res) => {
  try {
    const newDog = new Dog(req.body);
    await newDog.save();

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

// Uppdaterad PUT-route som hanterar vänrelationer ömsesidigt
app.put('/api/dogs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const dogToUpdate = await Dog.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!dogToUpdate) {
      return res.status(404).send('Dog not found.');
    }

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

app.post('/api/dogs/batch', async (req, res) => {
  try {
    const dogs = await Dog.find({ '_id': { $in: req.body.ids } });
    res.json(dogs);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
