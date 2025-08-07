import { Request , Response , NextFunction } from "express";
export const SECRET = 'SECr3t';  
import jwt from 'jsonwebtoken'

export const authenticateJwt = (req:Request , res:Response , next : NextFunction)=>{

    const authHeader = req.headers.authorization;
    console.log(authHeader) ; 
    if(authHeader){
        const token = authHeader.split(" ")[1] ; 
        jwt.verify(token , SECRET , (err ,payload)=>{
            
            if(err){
                return res.sendStatus(403) ; 
            }

            if(!payload){
                return res.sendStatus(403) ; 
            }

            if(typeof payload == 'string'){
                return res.sendStatus(403) ; 
            }
            // console.log(payload.id); 
            req.headers['recruiterId'] = payload.id ;
            next() ; 
        })
    }else{
        res.sendStatus(401).json({message:"unauthorized"})
    }
}