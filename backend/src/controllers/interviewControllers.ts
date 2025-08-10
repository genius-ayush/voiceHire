import { Request, Response } from "express";


export const conductInterview = (req:Request , res : Response)=>{

    const recruiterId = req.headers["recruiterId"];

    if (typeof recruiterId !== "string") {
        return res.status(400).json({ message: "Invalid recruiter ID" })
    }

    const {jobId , candidateId} = req.body ; 

    // dbquery 

    const candidate_info = {"name" : "ayush" , } ; 

    const questions = {"ayush" : "thie is question"} ; 

    //conducting interview based on that info

    // orationai... 

    // save the result ; 


}