import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History as HistoryIcon, Plus } from "lucide-react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

// Text parser (for markdown format fallback)
function parseSolutionText(text) {
  const diseaseNameMatch = text.match(/\*\*Disease\*\*:\s*(.*?)(?=\*\*|$)/s);
  const symptomsMatch = text.match(/\*\*Symptoms\*\*:\s*(.*?)(?=\*\*|$)/s);
  const causeMatch = text.match(/\*\*Cause\*\*:\s*(.*?)(?=\*\*|$)/s);
  const treatmentMatch = text.match(/\*\*Treatment\*\*:\s*(.*?)(?=\*\*|$)/s);
  const preventMatch = text.match(/\*\*Prevention\*\*:\s*(.*?)(?=\*\*|$)/s);

  return {
    diseaseName: diseaseNameMatch ? diseaseNameMatch[1].trim() : "Unknown Disease",
    symptoms: symptomsMatch ? symptomsMatch[1].trim() : "",
    cause: causeMatch ? causeMatch[1].trim() : "",
    treatment: treatmentMatch ? treatmentMatch[1].trim() : "",
    prevention: preventMatch ? preventMatch[1].trim() : "",
  };
}


export default function DiseaseResultPage() {
  const { getToken } = useAuth();
  const [history, setHistory] = useState([]);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const fetchedToken = await getToken();
        setToken(fetchedToken);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}crop/history`,
          {
            headers: {
              Authorization: `Bearer ${fetchedToken}`,
            },
          }
        );
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
    fetchHistory();
  }, [getToken]);


  const handleResolve = async (id) => {
    if (!token) return alert("Not authorized");

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}crop/resolve/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHistory((prev) => prev.filter((item) => item._id !== id));
      alert("Resolved successfully!");

    } catch (error) {
      alert("Failed to resolve.");
      console.error(error);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">
            Detection History
          </h1>
          <p className="text-green-700">
            View and manage your crop disease detection history
          </p>
        </div>

        <Card className="backdrop-blur-md bg-white/70 border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HistoryIcon className="w-5 h-5" />
              <span>Your Detection History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-12 text-green-600">
                <HistoryIcon className="w-16 h-16 mx-auto mb-4 text-green-300" />
                <h3 className="text-lg font-medium text-green-900 mb-2">
                  No detection history yet
                </h3>
                <p className="text-green-600 mb-6">
                  Start by uploading and analyzing crop images to build your
                  history
                </p>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 text-lg rounded-xl cursor-pointer"
                  onClick={() => navigate("/upload")}
                >
                  <div className="flex gap-2 items-center">
                    <Plus className="w-5 h-5" />
                    Upload Crop Photo
                  </div>
                </button>
              </div>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                {history.map((item, idx) => {
                  const parsed =
                    typeof item.solution === "string"
                      ? parseSolutionText(item.solution)
                      : {
                          diseaseName: item.solution?.diseaseName || "Unknown Disease",
                          symptoms: item.solution?.symptoms?.join(", ") || "",
                          treatment: item.solution?.treatment?.join(", ") || "",
                          prevention: item.solution?.prevention?.join(", ") || "",
                        };

                  return (
                    <li
                      key={idx}
                      className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-center border border-green-100 "
                    >
                      <img
                        src={item.imageUrl}
                        alt="Detected Crop"
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h2 className="text-lg font-bold text-red-700 mb-2">
                        🦠 {parsed.diseaseName}
                      </h2>

                      <Badge className={`${item.confidence >= 50 ? "bg-green-500" : "bg-red-500"} mb-2`}>
                         Confidence:{" "}{item.confidence}%
                      </Badge>

                      <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-left w-full space-y-2">
                        <h4 className="text-sm font-semibold text-green-700 underline">
                          Solution Details
                        </h4>

                        {parsed.symptoms && (
                          <p className="text-green-800 text-sm">
                            <strong>🌾 Symptoms:</strong> {parsed.symptoms}
                          </p>
                        )}
                        {parsed.treatment && (
                          <p className="text-green-800 text-sm">
                            <strong>🧪 Treatment:</strong> {parsed.treatment}
                          </p>
                        )}
                        {parsed.cause && (
                          <p className="text-green-800 text-sm">
                            <strong>🌿 Cause:</strong> {parsed.cause}
                          </p>
                        )}
                        {parsed.prevention && (
                          <p className="text-green-800 text-sm">
                            <strong>🌿 Prevention:</strong> {parsed.prevention}
                          </p>
                        )}
                      </div>
                        
                      <div className="text-xs text-gray-400 mt-3">
                        Created On: {item.createdAt.split("T")[0]}
                      </div>

                      <Button onClick={() => handleResolve(item._id)} className="w-full outline-none text-sm mt-2 bg-red-500 text-white hover:bg-red-700">
                        ✅ Mark as Resolved
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
