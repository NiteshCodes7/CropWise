import express from 'express'
import { handleVoiceAssistant } from '../controllers/voice.controller'

voiceRouter = express.Router();

voiceRouter.route("/voice").get(handleVoiceAssistant)

export default voiceRouter;