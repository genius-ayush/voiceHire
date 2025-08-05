import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express"
const prisma = new PrismaClient();

export const createJob = async (req: Request, res: Response) => {
    try {
        const { title, description, requirements, location, salaryRange, experienceLevel, department } = req.body;

        const recruiterId = req.headers["recruiterId"];
         
        if (typeof recruiterId !== "string") {
            return res.status(400).json({ message: "Invalid recruiter ID" })
        }

        const job = await prisma.jobPosting.create({
            data: {
                title,
                description,
                requirements,
                location,
                salaryRange,
                experienceLevel,
                department,
                recruiterId,
            },
        });
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create job', err });
    }

}

export const getJobs = async(req: Request, res: Response) => {

    try {
        const recruiterId = req.headers["recruiterId"];
        if (typeof recruiterId !== "string") {
            return res.status(400).json({ message: "Invalid recruiter ID" })
        }

        const jobs = await prisma.jobPosting.findMany({
            where:{recruiterId},
        })

        res.status(200).json(jobs) ; 

    } catch (err) {
        res.status(500).json({ error: "Failed to fetch jobs", err });
    }
}

export const getJobById = async(req: Request, res: Response) => {

    try{

        const job = await prisma.jobPosting.findUnique({
            where:{id: req.params.id} , 
        })

        if(!job) return res.status(404).json({error:'Job not found'}) ; 

        res.status(200).json(job) ; 

    }catch(err){
        res.status(500).json({error:'Failed to fetch job' , err}) ;
    }
}

export const updateJobs = async(req: Request, res: Response) => {

    try{

        const job = await prisma.jobPosting.update({
            where:{id:req.params.id},
            data : req.body , 
        })

        res.status(200).json(job) ; 
    }catch(err){
        res.status(500).json({error:'Failed to update job' , err})
    }
}

export const deleteJob = async(req: Request, res: Response) => {
    try{
        await prisma.jobPosting.delete({
            where:{id: req.params.id} , 
        })
        res.status(200).json({ message: 'Job deleted successfully' });
    }catch(err){
        res.status(500).json({error: 'Failed to delete job' , err})
    }
}