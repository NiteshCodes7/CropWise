import React from "react";
import { MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SmsAdvisory() {
  const { t } = useTranslation("dashboard");
  
  return (
    <div className="bg-white/70 backdrop-blur rounded-xl p-6 shadow-lg">
      <div className="flex items-center text-green-900 mb-4">
        <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
        <h2 className="text-xl font-semibold">{t("sms.heading")}</h2>
      </div>

      <p className="text-sm">
        📱 Send SMS to:{" "}
        <strong>{import.meta.env.VITE_TWILIO_PUBLIC_NUMBER}</strong>
      </p>

      <p className="mt-2 text-sm">📝 Format:</p>

      <div className="bg-green-50 border p-2 rounded mt-1 text-xs leading-relaxed">
        CROP &lt;crop_name&gt; &lt;location_code&gt;
        <br />
        SYM &lt;crop&gt; &lt;symptom_code&gt;
      </div>

      <div className="mt-4 text-sm text-green-800">
        Example:
        <ul className="list-disc list-inside mt-1">
          <li>CROP Wheat WB001</li>
          <li>SYM Rice SYM03</li>
        </ul>
      </div>
    </div>
  );
}
