import { Router } from "express";
import { authenticateJwt } from "../middlewares";
import { addQuestion, deleteQuestion, getQuestions, updateQuestion } from "../controllers/questionControllers";

const router = Router() ; 
router.post("/jobs/:jobId/questions" , authenticateJwt , addQuestion) ; 

router.get("/jobs/:jobId/questions" , authenticateJwt , getQuestions) ; 

router.put("/questions/:id" , authenticateJwt , updateQuestion) ; 

router.delete("/questions/:id" , authenticateJwt , deleteQuestion) ; 

export default router ; 