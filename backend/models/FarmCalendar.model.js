import mongoose from "mongoose";

const farmCalendarSchema = new mongoose.Schema({
  userId: { type: String, required: true },       
  crop: { type: String, required: true },
  location: { type: String, required: true },
  calendar: {
    type: Map,
    of: [String],   // Tasks per month
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export const FarmCalendar = mongoose.model("FarmCalendar", farmCalendarSchema);
