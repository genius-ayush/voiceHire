import { Router } from "express";
import { authenticateJwt } from "../middlewares";
import { conductInterview } from "../controllers/interviewControllers";

const router = Router() ; 

router.post("/conductInterview" , authenticateJwt , conductInterview) ; 

export default router ; 