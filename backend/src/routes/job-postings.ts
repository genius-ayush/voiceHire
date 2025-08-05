import { Router } from "express";
import { authenticateJwt } from "../middlewares";
import { createJob, deleteJob, getJobById, getJobs, updateJobs } from "../controllers/jobControllers";

const router  = Router() ; 

router.post("/jobs" , authenticateJwt , createJob) ; 

router.get("/jobs" , authenticateJwt , getJobs) ; 

router.get("/jobs/:id" , authenticateJwt , getJobById) ; 

router.put("/jobs/:id" , authenticateJwt , updateJobs) ; 

router.delete("/jobs/:id" , authenticateJwt , deleteJob) ; 

export default router ; 