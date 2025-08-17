import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  DollarSign,
  BarChart3,
  Filter,
  Database,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function MarketPrice() {
  const { t } = useTranslation("weather");

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVariety, setSelectedVariety] = useState("");
  const [marketData, setMarketData] = useState(null);
  const [marketLoading, setMarketLoading] = useState(false);
  const [marketError, setMarketError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // States, Districts, Varieties (static for now)
  const states = ["Maharashtra", "Karnataka", "Punjab", "Gujarat", "Tamil Nadu", "West Bengal"];
  const districts = {
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Karnataka: ["Bangalore", "Mysore"],
    Punjab: ["Ludhiana", "Amritsar"],
    Gujarat: ["Ahmedabad", "Surat"],
    "Tamil Nadu": ["Chennai", "Coimbatore"],
    "West Bengal": ["Kolkata", "Howrah"]
  };
  const varieties = ["Wheat", "Rice", "Cotton", "Sugarcane", "Soybean", "Corn", "Apple", "Banana"];

  // Fetch Market Data
  const fetchMarketData = async () => {
    const errors = {};
    if (!selectedState) errors.state = "Required";
    if (!selectedDistrict) errors.district = "Required";
    if (!selectedVariety) errors.variety = "Required";

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setMarketLoading(true);
    setMarketError(null);

    try {
      const apiKey = `${import.meta.env.VITE_MARKET_PRICE_KEY}`;
      const url = `https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24?api-key=${apiKey}&format=json&filters[State]=${encodeURIComponent(
        selectedState
      )}&filters[District]=${encodeURIComponent(
        selectedDistrict
      )}&filters[Commodity]=${encodeURIComponent(selectedVariety)}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(t("status.error"));

      const json = await response.json();
      const records = json.records || [];

      const cleanedData = records.map((rec) => ({
        name: rec.Commodity || selectedVariety,
        price: rec.Modal_Price || "N/A",
        unit: t("labels.unit"),
        change: Math.round((Math.random() - 0.5) * 100),
        changePercent: Math.round((Math.random() - 0.5) * 20),
        arrivalDate: rec.Arrival_Date || null,
      }));

      setMarketData(cleanedData);
    } catch (error) {
      setMarketError(error.message);
    } finally {
      setMarketLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedVariety("");
    setFormErrors({});
    setMarketData(null);
    setMarketError(null);
  };

  const handleFormChange = (field, value) => {
    if (field === "state") {
      setSelectedState(value);
      setSelectedDistrict("");
    } else if (field === "district") {
      setSelectedDistrict(value);
    } else if (field === "variety") {
      setSelectedVariety(value);
    }

    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-900 flex items-center">
        <BarChart3 className="w-6 h-6 mr-2" />
        {t("market.title")}
      </h2>

      {/* Market Form */}
      <Card className="backdrop-blur-md bg-white/70 border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-green-900 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            {t("market.subtitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* State */}
            <div className="space-y-2">
              <Label className="text-green-700 font-medium">
                {t("market.labels.state")} <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedState}
                onValueChange={(value) => handleFormChange("state", value)}
              >
                <SelectTrigger
                  className={`bg-white/50 border-white/30 ${
                    formErrors.state ? "border-red-300" : ""
                  }`}
                >
                  <SelectValue placeholder={t("market.labels.state")} />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.state && (
                <p className="text-red-600 text-sm">{formErrors.state}</p>
              )}
            </div>

            {/* District */}
            <div className="space-y-2">
              <Label className="text-green-700 font-medium">
                {t("market.labels.district")} <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedDistrict}
                onValueChange={(value) => handleFormChange("market.district", value)}
                disabled={!selectedState}
              >
                <SelectTrigger
                  className={`bg-white/50 border-white/30 ${
                    formErrors.district ? "border-red-300" : ""
                  }`}
                >
                  <SelectValue placeholder={t("market.labels.district")} />
                </SelectTrigger>
                <SelectContent>
                  {(districts[selectedState] || []).map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.district && (
                <p className="text-red-600 text-sm">{formErrors.district}</p>
              )}
            </div>

            {/* Variety */}
            <div className="space-y-2">
              <Label className="text-green-700 font-medium">
                {t("market.labels.variety")} <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedVariety}
                onValueChange={(value) => handleFormChange("variety", value)}
              >
                <SelectTrigger
                  className={`bg-white/50 border-white/30 ${
                    formErrors.variety ? "border-red-300" : ""
                  }`}
                >
                  <SelectValue placeholder={t("market.labels.variety")} />
                </SelectTrigger>
                <SelectContent>
                  {varieties.map((variety) => (
                    <SelectItem key={variety} value={variety}>
                      {variety}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.variety && (
                <p className="text-red-600 text-sm">{formErrors.variety}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={fetchMarketData}
              disabled={marketLoading}
              className="bg-green-600 hover:bg-green-700 flex-1 cursor-pointer"
            >
              {marketLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {t("market.buttons.fetching")}
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  {t("market.buttons.fetch")}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={resetForm}
              className="border-green-600 text-green-600 hover:bg-green-50 cursor-pointer"
            >
              {t("market.buttons.reset")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Market Prices Display */}
      <Card className="backdrop-blur-md bg-white/70 border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-green-900 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            {t("market.title")}
            {selectedState && selectedDistrict && (
              <span className="text-sm font-normal text-green-600 ml-2">
                ({selectedDistrict}, {selectedState})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {marketLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-green-600 mb-4" />
              <p className="text-green-700">{t("market.status.loading")}</p>
            </div>
          ) : marketError ? (
            <div className="flex flex-col items-center justify-center py-12 text-red-600">
              <AlertCircle className="w-8 h-8 mb-4" />
              <p className="text-sm">{marketError}</p>
            </div>
          ) : marketData ? (
            <div className="space-y-3">
              {marketData.map((crop, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-white/50 border border-white/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-green-900">
                        {crop.name}
                      </h3>
                      <p className="text-xs text-green-600">
                        {t("market.labels.arrival")}: {crop.arrivalDate || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {crop.change >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          crop.change >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {crop.change >= 0 ? "+" : ""}
                        {crop.changePercent}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold text-green-900">
                        ₹{crop.price}
                      </div>
                      <div className="text-sm text-green-600">{crop.unit}</div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-medium ${
                          crop.change >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {crop.change >= 0 ? "+" : ""}₹{crop.change}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Database className="w-16 h-16 mx-auto mb-4 text-green-300" />
              <h3 className="text-lg font-medium text-green-900 mb-2">
                {t("market.status.noDataTitle")}
              </h3>
              <p className="text-green-600">{t("market.status.noDataMessage")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
