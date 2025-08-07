import { Request, Response, Router } from "express";
import {  stats } from "../controllers/authControllers";
import { authenticateJwt } from "../middlewares";

const router = Router() ; 


router.get("/stats" , authenticateJwt ,  stats) ; 

export default router ; 