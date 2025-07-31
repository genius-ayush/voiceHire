import { Request, Response, Router } from "express";
import { register } from "../controllers/authControllers";

const router = Router() ; 


router.post("register" , register)


router.post("/login" , (req , res)=>{

})


router.get("/me" , (req , res)=>{

})

export default router ; 
