import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import Navbar from "../components/Navbar";

export default function SoilHistory() {
  const { getToken } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}crop/soil/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (err) {
      console.error("❌ Soil history fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resolveHistory = async (id) => {
    try {
      const token = await getToken();
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}crop/soil/history/delete/:${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("History resolved of id:", id);
    } catch (err) {
      console.error("❌ error resolving history", err);
    }
  };


  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <>
    <Navbar />
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Clock className="w-5 h-5" />
          Soil Detection History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p>Loading history...</p>
        ) : history.length === 0 ? (
          <p>No history found.</p>
        ) : (
          history.map((item, index) => (
            <div
              key={index}
              className="border rounded p-3 bg-green-50 shadow-sm hover:bg-green-100 transition"
            >
              <p><strong>Soil Type:</strong> {item.type}</p>
              <p>
                <strong>Fertility:</strong>{" "}
                <span className={Number(item.score) < 5 ? "text-red-600" : "text-green-700"}>
                  {item.score} / 10
                </span>
              </p>
              <p className="text-sm text-green-800">
                <strong>Tip:</strong> {item.tip}
              </p>

              <Button 
                className="bg-red-500 text-white w-full"
                onClick={() => resolveHistory(item._id)}
              >
                Resolve
              </Button>

              <p className="text-xs text-gray-500 mt-1">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
    </>
  );
}
