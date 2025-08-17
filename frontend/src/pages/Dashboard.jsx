import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import Navbar from "../components/Navbar.jsx";
import CalendarSection from "../components/CalendarSection.jsx";
import SoilScanner from "../components/SoilScanner.jsx";
import SmsAdvisory from "../components/SmsAdvisory.jsx";
import { useTranslation } from "react-i18next";

export default function CropWiseDashboard() {
  const [crop, setCrop] = useState("");
  const [location, setLocation] = useState("");
  const [calendar, setCalendar] = useState("");
  const [soilFile, setSoilFile] = useState(null);
  const [soilResult, setSoilResult] = useState(null);
  const [allCalendars, setAllCalendars] = useState([]);
  const [openCardId, setOpenCardId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { getToken } = useAuth();
  const { t } = useTranslation("dashboard");

  const handleCalendar = async (e) => {
    e.preventDefault();
    const token = await getToken();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}crop/calendar/generate`,
        { crop, location },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCalendar(res.data.data.calendar);
      await fetchCalendars();
    } catch (err) {
      console.error("\u274C Calendar error:", err.response?.data || err.message);
    }
  };

  const fetchCalendars = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}crop/calendar`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAllCalendars(res.data.calendars || []);
    } catch (err) {
      console.error("\u274C Fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendars();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-50 p-6">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-green-900 flex justify-center items-center">
              {t("title")}
            </h1>
            <p className="text-green-700">{t("subtitle")}</p>
          </div>

          {/* Calendar Section */}
          <CalendarSection
            crop={crop}
            setCrop={setCrop}
            location={location}
            setLocation={setLocation}
            handleCalendar={handleCalendar}
            allCalendars={allCalendars}
            openCardId={openCardId}
            setOpenCardId={setOpenCardId}
            loading={loading}
          />

          {/* Soil Scanner Section */}
          <SoilScanner
            soilFile={soilFile}
            setSoilFile={setSoilFile}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            soilResult={soilResult}
            setSoilResult={setSoilResult}
          />

          {/* SMS Advisory */}
          <SmsAdvisory />
        </div>
      </div>
    </>
  );
}
