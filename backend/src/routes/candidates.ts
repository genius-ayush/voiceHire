import { Router } from "express";
import { authenticateJwt } from "../middlewares";
import { addCandidate, deleteCandidate, getCandidate, listCandidates, updateCandidate } from "../controllers/candidateControllers";

const router = Router() ; 

router.post('/jobs/:jobId/candidates' , authenticateJwt , addCandidate) ; 

router.get('/jobs/:jobId/candidates' , authenticateJwt , listCandidates) ;

router.get('/candidates/:id' , authenticateJwt , getCandidate); 

router.put('/candidate/:id' , authenticateJwt , updateCandidate) ; 

router.delete('/candidate/:id' , authenticateJwt , deleteCandidate) ; 

export default router ; 