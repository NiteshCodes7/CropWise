import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import robotWave from "../assets/bot.gif"

const FloatingVoiceWidget = () => {
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [lang, setLang] = useState("hi");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const timeoutRef = useRef(null);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => console.log("🎤 Mic permission granted"))
      .catch((err) => {
        console.error("Mic access error:", err);
        setError("🎤 Mic access denied. Please allow mic permission.");
      });
  }, []);

  //session storage
  useEffect(() => {
    const savedConversation = sessionStorage.getItem("voice_conversation");
    if (savedConversation) {
      setConversation(JSON.parse(savedConversation));
    }
  }, []);

  const toggleWidget = () => setOpen(!open);

  const startListening = () => {
    if (!SpeechRecognition) {
      setError("🎤 Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = `${lang}-IN`;
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    setError("");
    setIsListening(true);

    recognition.start();

    recognition.onstart = () => {
      console.log("🎙️ Mic activated. Speak now...");
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      console.log("Speech detected:", spokenText);

      setConversation((prev) => [...prev, { role: "user", text: spokenText }]);

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        submitToVoiceAPI(spokenText);
      }, 3000);
    };

    recognition.onspeechend = () => {
      console.log("Speech ended, stopping recognition.");
      recognition.stop();
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech") {
        setError("🛑 No speech detected. Try again and speak clearly.");
      } else {
        setError(`⚠️ Speech error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      setIsListening(false);
    };
  };

  const submitToVoiceAPI = async (spokenText) => {
    const updatedConversation = [
      ...conversation,
      { role: "user", text: spokenText },
    ];
    setConversation(updatedConversation);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}crop/voice`,
        {
          conversation: updatedConversation,
          fromLang: lang,
          toLang: lang,
        }
      );

      const replyText =
          res.data.reply || "❌ No reply from Bot";

      setConversation((prev) => [...prev, { role: "ai", text: replyText }]);

      const utterance = new SpeechSynthesisUtterance(replyText);
      utterance.lang = `${lang}-IN`;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Voice API error:", err);
      setReply("❌ Server error. Try again.");
    }
  };

  //setting session storage
  useEffect(() => {
    sessionStorage.setItem("voice_conversation", JSON.stringify(conversation));
  }, [conversation]);

  return (
    <>
      {/* Floating Mic Button */}
      <button
        onClick={toggleWidget}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-green-600 overflow-hidden shadow-[4px_4px_12px_rgba(0,0,0,0.2),-4px_-4px_12px_rgba(255,255,255,0.1)] transform transition duration-200 hover:scale-105 active:scale-95 active:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.6)] hover:shadow-[0_0_12px_rgba(34,197,94,0.6)] z-50"
        aria-label="Open Voice Assistant"
      >
        <img src={robotWave} alt="Robot Waving" className="w-full h-[70%] object-cover" />
      </button>


      {/* Voice Assistant Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 p-4 rounded-xl shadow-2xl bg-white dark:bg-gray-900 text-black dark:text-white z-50">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold">🌾 CropWise Assistant</h2>
            <select
              className="text-sm p-1 border rounded cursor-pointer outline-none"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            >
              <option value="hi">हिन्दी</option>
              <option value="bn">বাংলা</option>
              <option value="en">English</option>
            </select>
          </div>

          <button
            onClick={startListening}
            disabled={isListening}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-3 cursor-pointer"
          >
            {isListening ? "🎙️ Listening..." : "🎤 Speak Now"}
          </button>

          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

          <div style={{ maxHeight: 300, overflowY: "auto" }}>
            {conversation.map((msg, i) => (
              <div
                key={i}
                style={{
                  textAlign: msg.role === "user" ? "right" : "left",
                  margin: "6px 0",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: 16,
                    background: msg.role === "user" ? "#DCF8C6" : "#F1F0F0",
                    maxWidth: "80%",
                  }}
                >
                  {msg.role === "ai" ? `🤖 - ${msg.text}` : `👤 - ${msg.text}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingVoiceWidget;
