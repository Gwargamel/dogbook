const express = require('express');
const mongoose = require('mongoose');
const Dog = require('./models/Dog.js');

const app = express();
app.use(express.json());

// Uppdatera med din riktiga MongoDB-anslutningssträng
mongoose.connect('mongodb://localhost:27017/dogbook', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

app.get('/api/dogs', async (req, res) => {
  const dogs = await Dog.find();
  res.json(dogs);
});

app.post('/api/dogs', async (req, res) => {
  const dog = new Dog(req.body);
  await dog.save();
  res.status(201).json(dog);
});

// Exempel på PUT-rutt för att uppdatera en hunds information
app.put('/api/dogs/:id', async (req, res) => {
  const { id } = req.params;
  const dog = await Dog.findByIdAndUpdate(id, req.body, { new: true });
  if (!dog) {
    return res.status(404).send('The dog with the given ID was not found.');
  }
  res.json(dog);
});

// Exempel på DELETE-rutt för att ta bort en hund
app.delete('/api/dogs/:id', async (req, res) => {
  const { id } = req.params;
  const dog = await Dog.findByIdAndRemove(id);
  if (!dog) {
    return res.status(404).send('The dog with the given ID was not found.');
  }
  res.status(204).send();
});

// Uppdaterad port till 5000
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
