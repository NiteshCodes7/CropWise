import React, { useState } from "react";
import axios from "axios";
import { Camera, ImageIcon, DatabaseIcon, FlaskConical } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SoilScanner() {
  const [soilFile, setSoilFile] = useState(null);
  const [soilResult, setSoilResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [detectUrl, setDetectUrl] = useState(null);
  const { getToken } = useAuth();
  const { t } = useTranslation("dashboard");
  

  const navigate = useNavigate();

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSoilFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDetectUrl(URL.createObjectURL(file));
      setSoilResult(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  const handleSoilUpload = async (e) => {
    e.preventDefault();
    if (!soilFile) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", soilFile);

    try {
      const token = await getToken();

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}crop/soil`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSoilResult(res.data);
      setSoilFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error("❌ Soil error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Upload Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>{t("soil.upload")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center w-full space-y-2">
          <form
            onSubmit={handleSoilUpload}
            className="flex flex-col items-center space-y-6 w-full"
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
                  <h3 className="font-medium">{t("soil.preview")}:</h3>
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
                      : "Drag & drop your soil image here or click to browse"}
                  </p>
                  <p className="text-xs text-green-500 mt-2">
                    JPG, PNG formats only. Max size: 5MB.
                  </p>
                </>
              )}
            </div>

            <Button
              type="submit"
              disabled={!soilFile || loading}
              className={`w-full bg-green-600 hover:bg-green-700 ${
                loading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {loading ? "Analyzing..." : t("soil.analyze")}
            </Button>
          </form>

          <p className="font-bold">OR</p>

          <Button className="bg-green-600 hover:scale-110 hover:bg-green-700 cursor-pointer" onClick={() => navigate("/soil-history")}>
            <DatabaseIcon />{t("soil.history")}
          </Button>
        </CardContent>
      </Card>

      {/* Result Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FlaskConical className="w-5 h-5" />
            <span>{t("soil.previewTitle")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!soilResult ? (
            <div className="text-center py-12 text-green-600">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No uploads yet. Your results will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4 text-2xl">
              {soilResult && (
                <div className="space-y-4 text-green-800 text-sm">
                  <p>
                    <img
                      src={detectUrl}
                      alt="Preview Img"
                      className="max-w-xs mx-auto bg-cover rounded shadow"
                    />
                  </p>
                  <p>
                    <span className="font-bold">Soil Type:</span>{" "}
                    {soilResult.type}
                  </p>
                  <p>
                    <span
                      className={`${
                        soilResult.score < 5 ? "text-red-500" : "text-green-500"
                      } font-bold`}
                    >
                      Fertility Score: {soilResult.score} / 10
                    </span>
                  </p>
                  <p>
                    <span className="font-bold">Improvement Tip:</span>{" "}
                    {soilResult.tip}
                  </p>
                </div>
              )}

              <div className="text-gray-400 text-xs text-center mt-4">
                Uploaded on: {new Date().toISOString().split("T")[0]}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
