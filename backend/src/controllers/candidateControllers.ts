import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient() ; 

export const addCandidate = async (req:Request , res:Response)=>{

    const {jobId} = req.params ; 

    try{

        const candidate = await prisma.candidate.create({
            data:{
                ...req.body, 
                jobPostingId : jobId,
            }
        })

        return res.status(201).json(candidate) ; 
    }catch(err){
        return res.status(500).json({message:'Error creating candidate' , err})
    }
}

export const listCandidates = async(req:Request , res:Response)=>{
    const {jobId} = req.params ;
    try{
        const candidates = await prisma.candidate.findMany({
            where:{jobPostingId:jobId} , 
            orderBy:{appliedAt:'desc'} , 
        })
        return res.json(candidates) ; 
    }catch(err){
        return res.status(500).json({message:'Error fetching candidates' , err})
    }
}

export const getCandidate = async(req:Request , res:Response)=>{
    try{
        const candidate = await prisma.candidate.findUnique({
            where:{id:req.params.id} , 
        }); 

        if(!candidate)return res.status(404).json({message:'Candidate not found'}); 

        return res.json(candidate) ; 

    }catch(err){
        return res.status(500).json({message:'Error fetching candidate' , err})
    }
}

export const updateCandidate = async(req:Request , res:Response)=>{

    try{
        const candidate = await prisma.candidate.update({
            where:{id:req.params.id}, 
            data: req.body,
        })

        return res.json(candidate);
    }catch(err){
        return res.status(500).json({message:'Error updating candidate' , err})
    }
}

export const deleteCandidate = async(req:Request , res:Response)=>{

    try{
        await prisma.candidate.delete({
            where:{id:req.params.id},
        }); 

        return res.status(204).send() ; 
    }catch(err){
        return res.status(500).json({message:'Error deleting candidate' , err}) ; 
    }
}