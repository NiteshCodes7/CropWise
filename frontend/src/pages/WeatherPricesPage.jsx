import Navbar from "../components/Navbar"
import Weather from "../components/Weather";
import MarketPrice from "../components/MarketPrice";

export default function WeatherMarket() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">
            Weather & Market Center
          </h1>
          <p className="text-green-700">
            Real-time weather conditions and crop market prices
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Weather />
          <MarketPrice />
        </div>
      </div>
    </div>
  );
}
