import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Camera, CheckCircle, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDropzone } from "react-dropzone";

// Gemini solution parser
const parseGeminiSolution = (text) => {
  const parts = text.split(/\*\*(.*?)\*\*/).filter((p) => p.trim() !== "");
  let result = {
    diseaseName: "",
    symptoms: "",
    cause: "",
    treatment: "",
    prevention: "",
  };

  const diseaseNameMatch = text.match(/\*\*Disease\*\*:\s*(.*?)(?=\n|\r|$)/i);
  if (diseaseNameMatch) result.diseaseName = diseaseNameMatch[1].trim();

  for (let i = 0; i < parts.length; i++) {
    const label = parts[i].toLowerCase();
    const value = parts[i + 1]?.trim();
    if (label.includes("symptom")) result.symptoms = value;
    else if (label.includes("cause")) result.cause = value;
    else if (label.includes("treatment")) result.treatment = value;
    else if (label.includes("prevention")) result.prevention = value;
    else if (!result.diseaseName) result.diseaseName = parts[i];
    i++;
  }

  return result;
};

const PhotoUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const { getToken } = useAuth();

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDetectionResult(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setLoading(true);

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("lat", location.lat);
      formData.append("lng", location.lng);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}crop/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const aiParsed = parseGeminiSolution(response.data.solution || "");
      setDetectionResult({ ...response.data, parsed: aiParsed });
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        alert("⚠️ Unable to get location.");
      }
    );
  }, []);

  return (
    <>
      <Navbar className="z-50" />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-green-900 mb-2">
              Detect Your Crop Disease with AI
            </h1>
            <p className="text-green-700">
              Upload an image of your crop to detect diseases and get instant
              analysis
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Upload Image</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col items-center space-y-6"
                >
                  <div
                    {...getRootProps()}
                    className={`cursor-pointer border-2 border-dashed rounded-lg w-full py-10 text-center transition
                      ${
                        isDragActive
                          ? "bg-green-200 border-green-500"
                          : "bg-green-50 hover:bg-green-100 border-green-300"
                      }`}
                  >
                    <input {...getInputProps()} />
                    {previewUrl ? (
                      <div className="space-y-4">
                        <h3 className="font-medium">Preview:</h3>
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-w-xs mx-auto rounded shadow"
                        />
                        <span className="text-green-600 underline text-sm">
                          Choose Another Image
                        </span>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="w-12 h-12 text-green-400 mx-auto mb-4" />
                        <p className="text-green-600 text-sm">
                          {isDragActive
                            ? "Drop the image here..."
                            : "Drag & drop your image here or click to browse"}
                        </p>
                        <p className="text-xs text-green-500 mt-2">
                          JPG, PNG formats only. Max size: 5MB.
                        </p>
                      </>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={!selectedFile || loading}
                    className={`w-full bg-green-600 hover:bg-green-700 ${
                      loading ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    {loading ? "Analyzing..." : "Analyze Image"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Result Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Detection Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!detectionResult ? (
                  <div className="text-center py-12 text-green-600">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No uploads yet. Your results will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <img
                      src={detectionResult.imageUrl || previewUrl}
                      alt="Detection Preview"
                      className="w-full h-64 object-cover rounded border border-green-200"
                    />
                    <div className="flex flex-col justify-center items-center gap-3">
                      <h2 className="text-lg font-bold text-red-700">
                        🦠 Disease:{" "}
                        {detectionResult.parsed.diseaseName || "Unknown"}
                      </h2>
                      <Badge className="bg-green-500">
                        Confidence:{" "}{detectionResult.confidence}%
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-green-700">
                      <p>
                        <strong>🌾 Symptoms:</strong>{" "}
                        {detectionResult.parsed.symptoms || "N/A"}
                      </p>
                      <p>
                        <strong>🧪 Cause:</strong>{" "}
                        {detectionResult.parsed.cause || "N/A"}
                      </p>
                      <p>
                        <strong>🌿 Treatment:</strong>{" "}
                        {detectionResult.parsed.treatment || "N/A"}
                      </p>
                      <p>
                        <strong>🛡️ Prevention:</strong>{" "}
                        {detectionResult.parsed.prevention || "N/A"}
                      </p>
        
                    </div>

                    <div className="text-gray-400 text-xs text-center mt-4">
                      Uploaded on: {new Date().toISOString().split("T")[0]}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default PhotoUpload;
