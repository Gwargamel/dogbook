const express = require('express');
const mongoose = require('mongoose');
const Dog = require('./models/Dog.js');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/dogbook', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/api/dogs', async (req, res) => {
  const dogs = await Dog.find();
  res.json(dogs);
});

app.post('/api/dogs', async (req, res) => {
  const dog = new Dog(req.body);
  await dog.save();
  res.status(201).json(dog);
});

// Lägg till fler rutter för PUT och DELETE här...

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
