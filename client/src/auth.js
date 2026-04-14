const express = require('express');
const router = express.Router();
const User = require('./models/User');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
  const { Email, Password } = req.body;
  const user = await User.findOne({ Email });
  if (!user) return res.status(400).send("User not found");
  if (user.Password !== Password) return res.status(400).send("Invalid password");
  res.send({ message: "Login successful!" });
});

module.exports = router;