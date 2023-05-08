const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB database');
});

const locationSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  coordinates: {
    lat: Number,
    lon: Number,
  },
});

const Location = mongoose.model('Location', locationSchema);

app.get('/locations', async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/locations', async (req, res) => {
  console.log(req.body);

  const newLocation = new Location({
    name: req.body.name,
    coordinates: {
      lat: req.body.coordinates.lat,
      lon: req.body.coordinates.lon,
    },
  });

  try {
    const savedLocation = await newLocation.save();
    res.status(201).json(savedLocation);
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ message: 'Location with this name already exists' });
    } else {
      res.status(400).json({ message: err.message });
    }
  }
});

app.delete('/locations/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    await location.deleteOne();
    res.json({ message: 'Location deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/locations/exists/:locationName', async (req, res) => {
  try {
    const locationName = req.params.locationName;
    const location = await Location.findOne({ name: locationName });
    res.json({ exists: !!location });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.use(express.static(path.join(__dirname, '..', 'src')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'src/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
