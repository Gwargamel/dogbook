import express from 'express';
import mongoose from 'mongoose';
import Dog from './models/Dog.js';

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

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
