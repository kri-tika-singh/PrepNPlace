import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
    generateQuestions,
    submitAptitude,
    getMyAptitudes,
    getAptitudeReport
} from "../controllers/aptitude.controller.js";

const aptitudeRouter = express.Router();

aptitudeRouter.post("/generate-questions", isAuth, generateQuestions);
aptitudeRouter.post("/submit", isAuth, submitAptitude);
aptitudeRouter.get("/get-aptitude", isAuth, getMyAptitudes);
aptitudeRouter.get("/report/:id", isAuth, getAptitudeReport);

export default aptitudeRouter;