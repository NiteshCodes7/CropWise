import { FarmCalendar } from "../models/FarmCalendar.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 📌 Generate AI-based farming calendar
export const generateCalendar = async (req, res) => {
    const { crop, location } = req.body;
    const userId = req.auth?.userId;

    if (!crop || !location) {
        return res.status(400).json({ message: "Crop and region are required" });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `
                    You are an expert agricultural planner. Generate a farming calendar for the given crop and location.

                    Respond strictly in this JSON format:

                    {
                    "calendar": {
                        "January": ["activity1", "activity2"],
                        "February": ["activity1"],
                        ...
                        "December": ["activity1"]
                    }
                    }

                    Ensure:
                    - Every month is present (even if empty array)
                    - Activities are specific (e.g., "Sow seeds", "Apply urea", "Irrigation", "Weed control", "Harvesting")
                    - Base your advice on crop and location-specific climatic patterns.
                    Only return valid JSON with no extra explanation.

                    Crop: ${crop}
                    Location: ${location}
                    `
                        }
                    ]
                }
            ]
        });


        const responseText = await result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            return res.status(500).json({ error: "Could not parse Gemini calendar response", raw: responseText });
        }

        const parsed = JSON.parse(jsonMatch[0]);

        if (!parsed.calendar) {
            return res.status(500).json({ error: "Missing 'calendar' key in Gemini response", raw: parsed });
        }

        const saved = await FarmCalendar.create({
            userId,
            crop,
            location,
            calendar: parsed.calendar, 
        });

        res.status(201).json({ message: "✅ Calendar generated", data: saved });

    } catch (error) {
        console.error("❌ Error generating calendar:", error.message);
        res.status(500).json({ message: "Failed to generate calendar" });
    }
};

// 📌 Get all calendars for the user
export const getAllCalendars = async (req, res) => {
    const userId = req.auth?.userId;

    try {
        const calendars = await FarmCalendar.find({ userId }).sort({ createdAt: -1 });
        res.json({ calendars });
    } catch (error) {
        console.error("❌ Error fetching calendars:", error.message);
        res.status(500).json({ message: "Error fetching calendars" });
    }
};

// 📌 Get one calendar by ID
export const getCalendarById = async (req, res) => {
    const { id } = req.params;

    try {
        const calendar = await FarmCalendar.findById(id);
        if (!calendar) return res.status(404).json({ message: "Calendar not found" });

        res.json(calendar);
    } catch (error) {
        console.error("❌ Error fetching calendar:", error.message);
        res.status(500).json({ message: "Error fetching calendar" });
    }
};
