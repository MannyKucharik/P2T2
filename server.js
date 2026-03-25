const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require("mongoose");

// Import models (pets file)
const Pet = require('./models/pet');

const app = express();
app.use(cors());
app.use(express.json());

// Set up CORS Headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

// Connect to MongoDB
const url = process.env.MONGODB_URI;
mongoose.connect(url)
  .then(() => console.log("Mongo DB connected!"))
  .catch(err => console.log(err));

// Add a new pet (Max 3 per user)
app.post('/api/addpet', async (req, res) => {
  const { userId, name, species, age, healthConcerns, lastFeeding, lastWalk } = req.body;

  try {
    //Check how many pets this user already has
    const petCount = await Pet.countDocuments({ userId: userId });
    // If they already have 3 pets, return an error
    if (petCount >= 3) {
      return res.status(400).json({ error: "Limit reached: You can only have 3 pets per profile." });
    }

    // Calculate the next feed and walk times automatically
    const lastFedDate = new Date(lastFeeding);
     // 7 hours
    const nextFeeding = new Date(lastFedDate.getTime() + (7 * 60 * 60 * 1000));
    // 4 hours
    const lastWalkDate = new Date(lastWalk);
    const nextWalk = new Date(lastWalkDate.getTime() + (4 * 60 * 60 * 1000)); 

    // Create and save the new pet
    const newPet = new Pet({
      userId,
      name,
      species,
      age,
      healthConcerns,
      lastFeeding: lastFedDate,
      nextFeeding: nextFeeding,
      lastWalk: lastWalkDate,
      nextWalk: nextWalk
    });

    await newPet.save();
    res.status(200).json({ message: "Pet added successfully!", pet: newPet });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(5000, () => {
    console.log("Server listening on port 5000");
});