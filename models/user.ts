import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  VerificationCode?: string;
  isVerified: boolean;
  VerificationAttempts: number;
  LoginAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    match: /.+\@.+\..+/ 
  },
  password: { type: String, required: true, minlength: 6 },
  
  VerificationCode: { 
    type: String 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  VerificationAttempts: { 
    type: Number, 
    default: 0 
  },
  LoginAttempts: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });


const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema, "users");

export default User;