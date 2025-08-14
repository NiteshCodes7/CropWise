import mongoose from "mongoose";

const soilExamination = new mongoose.Schema({
    userId: String,
    type: String,
    score: Number,
    tip: String,
    imageUrl: String,
}, { timestamps: true })

export const soilTest = mongoose.model("soilTest", soilExamination); 