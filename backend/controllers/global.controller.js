import {GlobalDiagnosis} from "../models/globalDiagnosis.model.js";

export const getGlobalDiagnosisData = async (req, res) => {
    try {
       const entries = await GlobalDiagnosis.find({ status: "Diseased" }).sort({ createdAt: -1 });
        res.json(entries);

    } catch (error) {
        console.error("🔥 GLOBAL LOG ERROR:", error);
        res.status(500).json({ error: "Server error while fetching global logs." });
    }
}
