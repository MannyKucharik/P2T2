import mongoose, { Schema, Document } from 'mongoose';

// 1. Update the Interface to match your "Buddy" structure
export interface IPet extends Document {
    userId: string; 
    name: string;
    species: string;
    age: number;
    lastWalk?: Date;
    nextWalk: Date;
    walkRequired: boolean;
    feedInterval: number;
    notes: string;
}

// 2. Define the Schema
const PetSchema: Schema = new Schema({
    userId: { type: String, required: true }, 
    name: { type: String, required: true },
    species: { type: String, required: true },
    age: { type: Number, default: 0 },
    lastWalk: { type: Date, default: Date.now },
    nextWalk: { type: Date, default: Date.now },
    lastFeeding: { type: Date, default: Date.now },
    nextFeeding: { type: Date, default: Date.now },
    walkRequired: { type: Boolean, default: true },
    feedInterval: { type: Number, default: 8 },
    notes: { type: String, default: "" }
});

// 3. The "Secret Sauce" 
// We create the 'Pet' variable and link it to the 'Pet' collection
const Pet = mongoose.model<IPet>('Pet', PetSchema, 'Pet');

export default Pet;