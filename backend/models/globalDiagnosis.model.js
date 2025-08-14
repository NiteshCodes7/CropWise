// models/globalDiagnosis.model.js
import mongoose from 'mongoose';

const GlobalDiagnosisSchema = new mongoose.Schema({
  userId: String,
  email: String,
  phone: Number,
  crop: String,
  prediction: String,
  location: {
    lat: Number,
    lng: Number,
    region: String,
    district: String,
  },
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Healthy', 'Diseased', 'Unknown disease'],
    required: true
  },
});

export const GlobalDiagnosis = mongoose.model('GlobalDiagnosis', GlobalDiagnosisSchema);
