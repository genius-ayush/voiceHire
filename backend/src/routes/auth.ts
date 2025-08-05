import { Request, Response, Router } from "express";
import { login, me, register } from "../controllers/authControllers";
import { authenticateJwt } from "../middlewares";

const router = Router() ; 


router.post("/register" , register)


router.post("/login" , login)


router.get("/me", authenticateJwt , me)

export default router ; 
