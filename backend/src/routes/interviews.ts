import { Router } from "express";
import { authenticateJwt } from "../middlewares";
import { conduct_interview, get_interview_status } from "../controllers/interviewControllers";

const router = Router() ; 

router.post("/conductInterview" , authenticateJwt , conduct_interview) ; 

router.get('/getInterviewStatus/:interviewId', authenticateJwt , get_interview_status) ; 

export default router ; 