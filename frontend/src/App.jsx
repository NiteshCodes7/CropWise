import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import PhotoUpload from "./pages/PhotoUpload.jsx";
import DiseaseResultPage from "./pages/DiseaseResult.jsx";
import { SignIn, SignUp, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import FarmingTipsPage from "./pages/FarmingTipsPage.jsx";
import WeatherPricesPage from "./pages/WeatherPricesPage.jsx";
import FloatingVoiceWidget from "./pages/FloatingVoiceWidget.jsx";
import GlobalDiseaseMap from "./pages/GlobalDiseaseMap.jsx";
import NotFound from "./pages/NotFound.jsx";
import CropWiseDashboard from "./pages/Dashboard.jsx";
import SoilHistory from "./pages/SoilHistory.jsx";

export default function App() {
  return (
    <Router>
      
    <FloatingVoiceWidget />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        <Route
          path="/upload"
          element={
            <>
              <SignedIn>
                <PhotoUpload />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

        <Route
          path="/history"
          element={
            <>
            <SignedIn>
              <DiseaseResultPage />
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

        <Route
          path="/farmingtips"
          element={
            <>
            <SignedIn>
              <FarmingTipsPage />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
            </>
          }
        />

        <Route
          path="/weather"
          element={
            <>
            <SignedIn>
              <WeatherPricesPage />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
            </>
          }
        />

        <Route
          path="/global-log"
          element={
            <>
              <SignedIn>
                <GlobalDiseaseMap />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <CropWiseDashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

        <Route
          path="/soil-history"
          element={
              <SignedIn>
                <SoilHistory />
              </SignedIn>
          }
        />

          <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}
