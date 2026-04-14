import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { sendVerificationEmail } from './utils/mailer.js';

// Import Models
import Pet from './models/pets.js'; 
import User, { IUser } from './models/user.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_123';

// CORS Headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

// Connect to MongoDB
const url = process.env.MONGODB_URI || 'mongodb+srv://Tester:Tester123@cluster0.rxi4qr5.mongodb.net/VetNotes?retryWrites=true&w=majority';
mongoose.connect(url)
  .then(() => console.log("Mongo DB connected!"))
  .catch(err => console.log("Connection Error:", err));

// --- LOGIN ROUTE ---
app.post('/api/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ 
      email: { $regex: new RegExp("^" + email.trim() + "$", "i") } 
    });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log("🔑 Login successful for:", user.firstName);

    res.status(200).json({ 
      message: "Login successful!", 
      token: token,
      userId: user._id, 
      firstName: user.firstName 
    });

  } catch (err: any) {
    console.error("Server Error:", err.message); 
    res.status(400).json({ error: "Login failed.", details: err.message });
  }
});

// --- VERIFICATION ROUTE ---
app.post('/api/verify', async (req: Request, res: Response) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || user.VerificationCode !== code) {
      return res.status(400).json({ error: "Invalid code or user not found." });
    }

    user.isVerified = true;
    user.VerificationCode = undefined; 
    await user.save();

    console.log("Account verified:", email);
    res.status(200).json({ message: "Account verified successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Server error during verification." });
  }
});

// --- REGISTER ROUTE ---
app.post('/api/register', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      VerificationCode: code,
      isVerified: false
    });

    await newUser.save();
    await sendVerificationEmail(email, code);

    console.log("New user registered:", email);
    res.status(201).json({ message: "User registered! Check email." });

  } catch (err: any) {
    console.log("Registration Error:", err.message);
    res.status(400).json({ error: "Registration failed.", details: err.message });
  }
});

// --- FORGOT PASSWORD ROUTE ---
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.VerificationCode = resetCode;
    await user.save();

    await sendVerificationEmail(email, resetCode); 
    
    console.log("Reset code sent to:", email);
    res.status(200).json({ message: "Reset code sent!" });
  } catch (err) {
    console.log("Forgot Password Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- RESET PASSWORD ROUTE ---
app.post('/api/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const user = await User.findOne({ 
        email: email.toLowerCase(), 
        VerificationCode: code 
    }) as IUser | null;
    
    if (!user) return res.status(400).json({ error: "Invalid code or email" });

    user.password = newPassword; 
    user.VerificationCode = undefined;
    await user.save();

    console.log("Password updated for:", email);
    res.status(200).json({ message: "Password updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Server error during password reset." });
  }
});

app.listen(5000, () => {
    console.log("Server listening on port 5000");
});

// --- ADD PETS ROUTE ---
app.post('/api/pets', async (req, res) => {
  try {
      const { 
          userId, 
          name, 
          species, 
          walkRequired,
          feedInterval,
          notes,
          lastWalk,
          lastFeeding 
      } = req.body;

      const newPet = new Pet({
          userId,
          name,
          species,
          walkRequired, 
          feedInterval,
          notes,
          lastWalk,
          lastFeeding
      });

      const savedPet = await newPet.save();
      res.status(201).json(savedPet);
  } catch (err: any) {
      console.error("Save Error:", err.message);
      res.status(400).json({ error: err.message });
  }
});

// --- GET PET ROUTE ---
app.get('/api/pets/:userId', async (req: Request, res: Response) => {
  try {
    const pets = await Pet.find({ userId: req.params.userId });
    res.status(200).json(pets);
  } catch (err) {
    res.status(500).json({ error: "Error fetching pets" });
  }
});

// --- ADD NOTES ROUTE ---
app.patch('/api/pets/:id', async (req, res) => {
  try {
      const updatedPet = await Pet.findByIdAndUpdate(
          req.params.id, 
          { $set: req.body }, 
          { returnDocument: 'after' }
      );
      res.json(updatedPet);
  } catch (err: any) {
      res.status(400).json({ error: err.message });
  }
});

app.delete('/api/pets/:id', async (req, res) => {
  try {
      const petId = req.params.id;
      
      // Use findByIdAndDelete to remove it from the 'Pet' collection
      const deletedPet = await Pet.findByIdAndDelete(petId);

      if (!deletedPet) {
          return res.status(404).json({ message: "Pet not found in Archives" });
      }

      res.status(200).json({ message: "Pet deleted successfully" });
  } catch (err: any) {
      console.error("Delete Error:", err.message);
      res.status(500).json({ error: err.message });
  }
});

export default app;