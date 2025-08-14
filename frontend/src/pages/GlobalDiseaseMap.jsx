import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/styles";
import { Icon, divIcon, point } from "leaflet";
import location from "../assets/location.png";
import axios from "axios";
import Navbar from "../components/Navbar";

const customIcon = new Icon({
  iconUrl: `${location}`,
  iconSize: [38, 38],
});

const createCustomClusterIcon = (cluster) => {
  return new divIcon({
    html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
    className: "custom-cluster-marker",
    iconSize: point(33, 33, true)
  })
}

export default function GlobalDiseaseMap() {
  const [globalData, setGlobalData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}crop/global-log`
        );
        setGlobalData(res.data);
      } catch (err) {
        console.error("🌐 Error fetching global data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="h-[100vh] w-full z-0">
      <Navbar />
      <MapContainer
        center={[22.5726, 88.3639]}
        zoom={6}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup 
          chunkedLoading
          iconCreateFunction = {createCustomClusterIcon}
        >
          {globalData.map((entry, idx) => {
            const offsetLat = entry.location.lat + (Math.random() - 0.5) * 0.01;
            const offsetLng = entry.location.lng + (Math.random() - 0.5) * 0.01;

            return (
              <Marker
                key={idx}
                position={[offsetLat, offsetLng]}
                icon={customIcon}
              >
                <Popup>
                  <div>
                    <h4 className="font-bold text-sm">{entry.prediction}</h4>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className="text-red-500 font-bold">
                        {entry.status}
                      </span>
                    </p>
                    {entry.solution?.diseaseName && (
                      <p>
                        <strong>Disease:</strong> {entry.solution.diseaseName}
                      </p>
                    )}
                    {entry.location.region && (
                      <p>
                        <strong>Region:</strong> {entry.location.region}
                      </p>
                    )}
                    {entry.location.district && (
                      <p>
                        <strong>District:</strong> {entry.location.district}
                      </p>
                    )}
                    <img
                      src={entry.imageUrl}
                      alt="Crop"
                      className="mt-2 rounded shadow w-32"
                    />
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
