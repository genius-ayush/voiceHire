import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken'
import { SECRET } from "../middlewares";
const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {

    const { name, email, password } = req.body;
    try {

        const existingRecruiter = await prisma.recruiter.findUnique({ where: {email} });
        if (existingRecruiter) {
            return res.status(400).json({ message: 'Recruiter already exist' });
        }
        
        const newRecruiter = await prisma.recruiter.create({ data:{ name, email, password}});
        const token = jwt.sign({id : newRecruiter.id} , SECRET , { expiresIn: '1h' })
        return res.status(201).json({token , id : newRecruiter.id})

    } catch (err) {
        res.status(500).json({ error: 'Registeration failed' , err} );
    }
}

export const login = async(req: Request , res : Response)=>{

    const {email , password} = req.body ; 
    console.log(email) ; 
        console.log(password) ; 
    try{

        const recruiter = await prisma.recruiter.findFirst({where:{email , password}})
        console.log(recruiter) ; 

        if(recruiter){
            const token = jwt.sign({id: recruiter.id} , SECRET , {expiresIn:'1h'});  
            res.json({message: 'Logged in Successfully' , token , id: recruiter.id}) ; 
        }else{
            res.status(403).json({message: 'Invalid email or password'}) ;
        }
    }catch(err){
        res.status(500).json({error: 'Login failed' , err})
    } 
}

export const me = async(req : Request , res : Response)=>{

    const recruiterId = req.headers["recruiterId"] ; 

    if(typeof recruiterId !== "string"){
        return res.status(400).json({message:"Invalid recruiter ID"})
    }
     

    try{

        const recruiter = await prisma.recruiter.findUnique({where : {id : recruiterId}}) ;

        if(recruiter){
            res.json({recruiter: recruiter.name , email: recruiter.email , recruiterId})
        }else{
            res.status(403).json({message: 'recruter not loggedIn'});
        }
    }catch(err){
        console.log(err) ; 
    }
}
