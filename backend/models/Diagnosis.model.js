import mongoose, { Schema } from "mongoose";

const DiagnosisSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  email: String,
  phone: Number,
  location: {
    lat: Number,
    lng: Number,
    region: String,
    district: String,
  },
  filename: String,
  prediction: Object,
  confidence: Number,
  imageUrl: String,
  solution: {
    type: Schema.Types.Mixed,
    default: null
  }
}, { timestamps: true });

export const Diagnosis = mongoose.model("Diagnosis", DiagnosisSchema);