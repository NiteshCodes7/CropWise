import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const handleVoiceAssistant = async (req, res) => {
    const { conversation = [], toLang = "hi" } = req.body;

    if (!Array.isArray(conversation) || conversation.length === 0) {
        return res.status(400).json({ error: "Conversation history is required" });
    }

    try {
        console.log("📥 Received conversation:", conversation);

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Gemini's `contents`
        const contents = conversation.map((msg) => ({
            role: msg.role === "ai" ? "model" : "user",
            parts: [{ text: msg.text }],
        }));

        contents.unshift({
            role: "user",
            parts: [{
                text: `
                You are a multilingual agricultural assistant. 
                Respond to farmers’ queries in ${toLang}. Keep replies short (1-2 sentences).
                Avoid greetings, emojis, or markdown. Answer clearly and directly.
                `
            }]
        });


        const result = await model.generateContent({ contents });

        let reply = await result.response.text();
        reply = reply.replace(/[*_`~>-]+/g, "").replace(/\n+/g, " ").trim();

        console.log("🤖 Gemini reply:", reply);

        return res.json({
            reply
        });
    } catch (err) {
        console.error("❌ Voice Assistant Error:", err.message);
        return res.status(500).json({ error: "Voice assistant failed" });
    }
};

export default { handleVoiceAssistant };


//new SDK
// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// const handleVoiceAssistant = async (req, res) => {
//   const { conversation = [], toLang = "hi" } = req.body;

//   if (!Array.isArray(conversation) || conversation.length === 0) {
//     return res.status(400).json({ error: "Conversation history is required" });
//   }

//   try {
//     console.log("📥 Received conversation:", conversation);

//     const contents = [
//       {
//         role: "user",
//         parts: [
//           {
//             text: `
//             You are a multilingual agricultural assistant.
//             Respond to farmers’ queries in ${toLang}. Keep replies short (1–2 sentences).
//             Avoid greetings, emojis, or markdown. Answer clearly and directly.
//             `
//           }
//         ]
//       },
//       ...conversation.map((msg) => ({
//         role: msg.role === "ai" ? "model" : "user",
//         parts: [{ text: msg.text }],
//       }))
//     ];

//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents,
//     });

//     const result = response.text;

//     if (!result || result.trim() === "") {
//       throw new Error("No response from AI");
//     }

//     const cleanedReply = result.replace(/[*_`~>-]+/g, "").replace(/\n+/g, " ").trim();

//     console.log("🤖 Gemini reply:", cleanedReply);

//     return res.json({ reply: cleanedReply });
//   } catch (error) {
//     console.error("❌ Voice Assistant Error:", error.message);
//     return res.status(500).json({ error: "Voice assistant failed" });
//   }
// };

// export default { handleVoiceAssistant };
