import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";

import {
  Camera,
  History,
  Leaf,
  Menu,
  X,
  Cloud,
  LightbulbIcon,
  MapPin,
  LayoutDashboard,
} from "lucide-react";

export default function Navbar({ className }) {
  const [isOpen, setOpen] = useState(false);
  const { t, i18n } = useTranslation("navbar");

  const handleClick = () => setOpen(!isOpen);
  const changeLanguage = (e) => i18n.changeLanguage(e.target.value);

  return (
    <nav
      className={`backdrop-blur-md bg-white/70 border-b border-white/20 shadow-lg shadow-green-500/10 sticky top-0 z-50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-green-50/50 before:to-emerald-50/50 before:-z-10 font-inter ${className}`}
    >
      <div className="px-2 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-green-900">CropWise</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-sm px-4 py-2 font-medium flex gap-2 items-center transition-colors duration-150 ${
                  isActive
                    ? "bg-green-500 text-white rounded-lg"
                    : "text-green-600 hover:text-green-700"
                }`
              }
            >
              <LayoutDashboard /> {t("dashboard")}
            </NavLink>
            <NavLink
              to="/global-log"
              className={({ isActive }) =>
                `text-sm px-4 py-2 font-medium flex gap-2 items-center transition-colors duration-150 ${
                  isActive
                    ? "bg-green-500 text-white rounded-lg"
                    : "text-green-600 hover:text-green-700"
                }`
              }
            >
              <MapPin /> {t("diseaseMap")}
            </NavLink>
            <NavLink
              to="/upload"
              className={({ isActive }) =>
                `text-sm px-4 py-2 font-medium flex gap-2 items-center transition-colors duration-150 ${
                  isActive
                    ? "bg-green-500 text-white rounded-lg"
                    : "text-green-600 hover:text-green-700"
                }`
              }
            >
              <Camera /> {t("photoUpload")}
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `text-sm px-4 py-2 font-medium flex gap-2 items-center transition-colors duration-150 ${
                  isActive
                    ? "bg-green-500 text-white rounded-lg"
                    : "text-green-600 hover:text-green-700"
                }`
              }
            >
              <History /> {t("history")}
            </NavLink>
            <NavLink
              to="/weather"
              className={({ isActive }) =>
                `text-sm px-4 py-2 font-medium flex gap-2 items-center transition-colors duration-150 ${
                  isActive
                    ? "bg-green-500 text-white rounded-lg"
                    : "text-green-600 hover:text-green-700"
                }`
              }
            >
              <Cloud /> {t("weather")}
            </NavLink>
            <NavLink
              to="/farmingtips"
              className={({ isActive }) =>
                `text-sm px-4 py-2 font-medium flex gap-2 items-center transition-colors duration-150 ${
                  isActive
                    ? "bg-green-500 text-white rounded-lg"
                    : "text-green-600 hover:text-green-700"
                }`
              }
            >
              <LightbulbIcon /> {t("farmingTips")}
            </NavLink>
          </div>

          <div className="flex space-x-3.5 items-center justify-center">
            {/* Language Select */}
            <select
              onChange={changeLanguage}
              value={i18n.language}
              className="bg-white border border-green-300 text-green-700 text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500 cursor-pointer"
            >
              <option value="en">🌐 EN</option>
              <option value="hi">🇮🇳 हिन्दी</option>
              <option value="bn">🇮🇳 বাংলা</option>
            </select>

            <UserButton redirectUrl="/" />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={handleClick}
              className="text-green-700 focus:outline-none"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <ul className="md:hidden absolute top-16 right-4 bg-white border border-green-100 shadow-md rounded-lg p-4 space-y-2 text-sm z-50">
            <li>
              <Link
                to="/dashboard"
                onClick={handleClick}
                className="text-green-700 hover:text-green-900 flex items-center gap-2"
              >
                <LayoutDashboard /> {t("dashboard")}
              </Link>
            </li>
            <li>
              <Link
                to="/global-log"
                onClick={handleClick}
                className="text-green-700 hover:text-green-900 flex items-center gap-2"
              >
                <MapPin /> {t("diseaseMap")}
              </Link>
            </li>
            <li>
              <Link
                to="/upload"
                onClick={handleClick}
                className="text-green-700 hover:text-green-900 flex items-center gap-2"
              >
                <Camera /> {t("photoUpload")}
              </Link>
            </li>
            <li>
              <Link
                to="/history"
                onClick={handleClick}
                className="text-green-700 hover:text-green-900 flex items-center gap-2"
              >
                <History /> {t("history")}
              </Link>
            </li>
            <li>
              <Link
                to="/weather"
                onClick={handleClick}
                className="text-green-700 hover:text-green-900 flex items-center gap-2"
              >
                <Cloud /> {t("weather")}
              </Link>
            </li>
            <li>
              <Link
                to="/farmingtips"
                onClick={handleClick}
                className="text-green-700 hover:text-green-900 flex items-center gap-2"
              >
                <LightbulbIcon /> {t("farmingTips")}
              </Link>
            </li>

            {/* Language Select for Mobile */}
            <li className="flex items-center gap-2">
              🌐
              <select
                onChange={changeLanguage}
                value={i18n.language}
                className="border border-green-300 text-green-700 text-sm rounded-md px-2 py-1 focus:outline-none cursor-pointer"
              >
                <option value="en">EN</option>
                <option value="hi">HI</option>
                <option value="bn">BN</option>
              </select>
            </li>

            <li>
              <UserButton redirectUrl="/" />
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}
