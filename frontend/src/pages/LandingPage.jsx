import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";

import step1 from "../assets/step1.png";
import step2 from "../assets/step2.png";
import step3 from "../assets/step3.png";
import Disease from "../assets/Disease.png";
import Farming from "../assets/Farming.png";
import Weather from "../assets/Weather.png";

import { ArrowRight, Leaf, History } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation("landing");

  const features = [
    {
      icon: Disease,
      title: t("landing.features.0.title"),
      desc: t("landing.features.0.desc"),
    },
    {
      icon: Farming,
      title: t("landing.features.1.title"),
      desc: t("landing.features.1.desc"),
    },
    {
      icon: Weather,
      title: t("landing.features.2.title"),
      desc: t("landing.features.2.desc"),
    },
  ];

  const steps = [
    {
      icon: step1,
      title: t("landing.steps.0.title"),
      desc: t("landing.steps.0.desc"),
    },
    {
      icon: step2,
      title: t("landing.steps.1.title"),
      desc: t("landing.steps.1.desc"),
    },
    {
      icon: step3,
      title: t("landing.steps.2.title"),
      desc: t("landing.steps.2.desc"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-50 font-inter text-gray-800">
      <Navbar className="fixed z-50 bg-blur bg-opacity-80 backdrop-blur-md shadow-md" />

      {/* Hero Section */}
      <section className="text-center min-h-screen flex flex-col justify-center items-center mt-10 md:mt-0">
        <div className="mb-3">
          <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Leaf className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-green-900 mb-4 leading-tight">
          {t("landing.title")}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
            {t("landing.subtitle")}
          </span>
        </h1>
        <p className="text-xl text-green-700 mb-8 max-w-3xl mx-auto leading-relaxed">
          {t("landing.description")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 text-lg rounded-xl cursor-pointer"
            onClick={() => navigate("/upload")}
          >
            <div className="flex gap-2 items-center">
              <ArrowRight />
              {t("landing.startDetection")}
            </div>
          </button>
          <button
            className="border border-green-600 text-green-600 hover:bg-green-50 px-8 py-2 text-lg rounded-xl cursor-pointer"
            onClick={() => navigate("/history")}
          >
            <div className="flex gap-2 items-center">
              <History />
              {t("landing.viewHistory")}
            </div>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900">95%</div>
            <div className="text-green-600">{t("landing.accuracy")}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900">&lt; 10s</div>
            <div className="text-green-600">{t("landing.time")}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900">30+</div>
            <div className="text-green-600">{t("landing.types")}</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-green-900 mb-4">
              {t("landing.why")}
            </h2>
            <p className="text-green-700 text-lg max-w-2xl mx-auto">
              {t("landing.whyDesc")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="text-center bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <img
                  src={feature.icon}
                  width="400px"
                  height="400px"
                  alt="feature icon"
                  className="mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-green-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-green-900 mb-4">
              {t("landing.how")}
            </h2>
            <p className="text-green-700 text-lg">{t("landing.howDesc")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center">
                <img
                  src={step.icon}
                  alt={`Step ${idx + 1}`}
                  width={400}
                  height={400}
                  className="mx-auto mb-6 rounded-xl p-4"
                />
                <h3 className="text-xl font-semibold text-green-900 mb-3">
                  {`${idx + 1}. ${step.title}`}
                </h3>
                <p className="text-green-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t("landing.ctaTitle")}
          </h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            {t("landing.ctaDesc")}
          </p>
          <button
            className="bg-white text-green-600 font-bold hover:bg-green-100 px-8 py-3 text-lg rounded-xl cursor-pointer"
            onClick={() => navigate("/farmingtips")}
          >
            <div className="flex items-center gap-2">
              {t("landing.ctaBtn")}
              <ArrowRight />
            </div>
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
