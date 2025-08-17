import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation("footer");

  return (
    <footer className="mb-1 p-20 text-center text-sm text-gray-500">
      <div className="font-semibold mb-2">{t("title")}</div>
      <p className="mb-2">{t("subtitle")}</p>
      <input type="email" placeholder={t("email")} className="border p-2 rounded mr-2" />
      <button className="bg-green-600 font-inter text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer">{t("sub")}</button>
      <div className="mt-4 text-xs">{t("copyright")}</div>
      <div className="mt-4 text-xs">{t("made")}</div>
    </footer>
  );
}
