import { Router } from "express";
import { authenticateJwt } from "../middlewares";
import { conduct_interview, conductInterview } from "../controllers/interviewControllers";

const router = Router() ; 

router.post("/conductInterview" , authenticateJwt , conduct_interview) ; 

export default router ; 