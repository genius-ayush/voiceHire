import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken'
import { SECRET } from "../middlewares";
const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {

    const { name, email, password, company } = req.body;

    try {

        const existingRecruiter = await prisma.recruiter.findUnique({ where: email });

        if (existingRecruiter) {
            return res.status(400).json({ message: 'Recruiter already exist' });
        }

        const newRecruiter = new prisma.recruiter.create({ data:{ name, email, password , company}});

        const token = jwt.sign({id : newRecruiter.id} , SECRET , { expiresIn: '1h' })
        return res.status(201).json({token , newRecruiter})

    } catch (err) {
        res.status(500).json({ error: 'Registeration failed' });
    }
}

export const login = async(req: Request , res : Response)=>{

    const {email , password} = req.body ; 

    try{

        const recruiter = await prisma.recruiter.findUnique({where:{email , password}})


        if(recruiter){
            const token = jwt.sign({id: recruiter.id} , SECRET , {expiresIn:'1h'});  
            res.json({message: 'Logged in Successfully' , token , recruiterId: recruiter.id}) ; 
        }else{
            res.status(403).json({message: 'Invalid email or password'}) ;
        }
    }catch(err){
        res.status(500).json({error: 'Login failed'})
    } 
}

export const me = async(req : Request , res : Response)=>{

    const recruiterId = req.headers["userId"] ; 
    const recruiter = await prisma.Recruiter.findUnique({id : recruiterId}) ; 

    try{

        if(recruiter){
            res.json({recruiter: recruiter.name , email: recruiter.email , recruiterId})
        }else{
            res.status(403).json({message: 'recruter not loggedIn'});
        }
    }catch(err){
        console.log(err) ; 
    }
}
