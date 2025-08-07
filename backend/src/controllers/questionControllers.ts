import {  PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient() ; 

export const addQuestion = async (req: Request, res: Response) => {
    console.log("reached here or not") ; 
    try {

        const { jobId } = req.params;
        console.log(jobId) ; 
        const { questionText, category, difficulty, expectedAnswer, keywords, maxDuration, order } = req.body;

        const question = await prisma.question.create({
            data:{
                questionText , 
                category , 
                difficulty , 
                expectedAnswer , 
                keywords , 
                maxDuration , 
                order , 
                jobPostingId : jobId
            }
        })

        res.status(201).json({message:'Question created successfully' , question})

    } catch (err) {
        res.status(500).json({ error: 'Failed to create question', details: err })
    }

}

// Get all questions for a job
export const getQuestions = async(req : Request , res : Response)=>{

    const {jobId} = req.params ; 

    try{

        const questions = await prisma.question.findMany({
            where:{jobPostingId:jobId} , 
            orderBy: { order: 'asc' },
        })
        res.status(200).json({questions}) ; 
    }catch(err){
        res.status(500).json({error:'Failed to get questions' , detail: err}) ; 
    }
}

// Update a question
export const updateQuestion = async(req:Request , res:Response)=>{
    const {id} = req.params ; 
    const updateData = req.body ; 

    try{
        const updated = await prisma.question.update({
            where:{id} , 
            data:updateData , 
        })
        res.status(200).json({message : "Question updated" , updated})
    }catch(err){
        res.status(500).json({error : "Failed to update question" , detail : err})
    }
}

//Delete a question 

export const deleteQuestion = async (req:Request , res:Response)=>{

    const {id} = req.params ; 

    try{
        await prisma.question.delete({where:{id}}) ; 
        res.status(200).json({message:"Question deleted"}) ; 
    }catch(err){
        res.status(500).json({error:"Failed to delete Question" , detail:err}) ; 
    }
}

