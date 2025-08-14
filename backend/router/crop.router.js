import express from "express";
import multer from "multer";
import { uploadImageAndDiagnose, getDiagnosisHistory, getGeminiSolution, resolveDisease } from "../controllers/crop.controller.js";
import voiceController from "../controllers/voice.controller.js";
import {getGlobalDiagnosisData} from "../controllers/global.controller.js"
import { verifyClerkToken } from "../middleware/auth.middleware.js";
import { soilFertility, soilHistory, resolveSoilHistory } from "../controllers/soil.controller.js"
import smsOffline from "../controllers/sms.controller.js"
import {
  generateCalendar,
  getAllCalendars,
  getCalendarById,
} from "../controllers/FarmCalendar.controller.js";


const cropRouter = express.Router();
const upload = multer();

cropRouter.route("/upload").post(verifyClerkToken, upload.single("image"), uploadImageAndDiagnose, getGeminiSolution);
cropRouter.route("/history").get(verifyClerkToken, getDiagnosisHistory);
cropRouter.route("/resolve/:id").delete(verifyClerkToken, resolveDisease );
cropRouter.route("/voice").post(voiceController.handleVoiceAssistant);
cropRouter.route("/global-log").get(getGlobalDiagnosisData);
cropRouter.route("/soil").post(verifyClerkToken, upload.single("image"), soilFertility);
cropRouter.route("/soil-history").get(verifyClerkToken, soilHistory);
cropRouter.route("/soil-history/delete/:id").delete(verifyClerkToken, resolveSoilHistory);
cropRouter.route("/calendar/generate").post(verifyClerkToken, generateCalendar);
cropRouter.route("/calendar").get(verifyClerkToken, getAllCalendars);
cropRouter.route("/calendar/:id").get(verifyClerkToken, getCalendarById);
cropRouter.route("/sms").post(smsOffline);

export default cropRouter;