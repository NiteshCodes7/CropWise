import React, { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";

export default function CalendarSection() {
  const [crop, setCrop] = useState("");
  const [location, setLocation] = useState("");
  const [allCalendars, setAllCalendars] = useState([]);
  const [openCardId, setOpenCardId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { getToken } = useAuth();
  const { t } = useTranslation("dashboard");
  

  const fetchCalendars = async () => {
    const token = await getToken();
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}crop/calendar`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAllCalendars(res.data.calendars || []);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
      setSubmitLoading(false);

    }
  };

  useEffect(() => {
    fetchCalendars();
  }, []);

  const handleCalendar = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const token = await getToken();
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}crop/calendar/generate`,
        { crop, location },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCrop("");
      setLocation("");
      fetchCalendars();
    } catch (err) {
      console.error("Calendar error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur rounded-xl p-6 shadow-lg">
      <div className="flex items-center text-green-900 mb-4">
        <CalendarDays className="w-5 h-5 mr-2 text-green-700" />
        <h2 className="text-xl font-semibold">{t("calendar.heading")}</h2>
      </div>

      <form
        onSubmit={handleCalendar}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          type="text"
          placeholder="Crop (e.g., Rice)"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          className="p-2 border-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Location (e.g., Nadia)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-2 border-2 rounded"
          required
        />
        <button
          type="submit"
          className={`${submitLoading ? "bg-green-200 cursor-not-allowed" : "bg-green-600" }  text-white px-4 py-2 rounded`}
        >
          {`${submitLoading ? "Loading..." : t("calendar.form.generate")}`}
        </button>
      </form>

      <div className="mt-6">
        <h3 className="font-semibold text-green-800 mb-2">Saved Calendars</h3>
        {loading ? (
          <p className="text-sm text-gray-500">{t("loading")}</p>
        ) : allCalendars.length === 0 ? (
          <p className="text-sm text-gray-500">{t("empty")}</p>
        ) : (
          allCalendars.map((entry) => {
            const isOpen = openCardId === entry._id;
            return (
              <div
                key={entry._id}
                onClick={() =>
                  setOpenCardId(isOpen ? null : entry._id)
                }
                className="bg-green-50 p-4 rounded-lg mb-3 border cursor-pointer hover:bg-green-100"
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium text-green-900">
                    🌾 {entry.crop} — 📍 {entry.location}
                  </p>
                  <span className="text-sm text-gray-500">
                    {isOpen ? "▲" : "▼"}
                  </span>
                </div>
                {isOpen && (
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    {Object.entries(entry.calendar).map(
                      ([month, tasks]) => (
                        <div
                          key={month}
                          className="bg-white border p-2 rounded"
                        >
                          <strong>{month}</strong>
                          <ul className="list-disc pl-4 text-xs">
                            {tasks.map((task, i) => (
                              <li key={i}>{task}</li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
