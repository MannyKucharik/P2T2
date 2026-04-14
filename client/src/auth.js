const express = require('express');
const router = express.Router();
const User = require('./models/User'); // Adjust path if your file is named 'user.js'
const bcrypt = require('bcryptjs'); // You might need to install this: npm install bcryptjs

router.post('/login', async (req, res) => {
  const { Email, Password } = req.body;
  
  // 1. Find user by email
  const user = await User.findOne({ Email });
  if (!user) return res.status(400).send("User not found");

  // 2. Check password (assuming you're hashing them, or compare directly)
  if (user.Password !== Password) return res.status(400).send("Invalid password");

  res.send({ message: "Login successful!" });
});

module.exports = router;