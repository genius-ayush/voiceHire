import axios from "axios";
require('dotenv').config();
import { Request, Response } from "express";
const API_KEY = process.env.API_KEY;
const WORKSPACE_ID = process.env.WORKSPACE_ID;
const AGENT_ID = process.env.AGENT_ID;
const ORATION_BASE_URL = 'https://www.oration.ai/api/v2';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient() ; 

const orationHeaders = {
    'x-api-key': API_KEY,
    'x-workspace-id': WORKSPACE_ID,
    'Content-Type': 'application/json'
  };



export const conduct_interview = async(req: Request , res : Response)=>{


    try{
        const{
            jobId , 
            candidateId , 
            candidatePhone , 
            candidateName , 
            jobTitle , 
            questions , 
            recruiterName , 
            companyName 
        } = req.body ; 

        if (!jobId || !candidateId || !candidatePhone || !candidateName || !questions) {
            return res.status(400).json({
              success: false,
              message: 'Missing required fields: jobId, candidateId, candidatePhone, candidateName, questions'
            });
          }

        const dynamicVariables = {

            candidateName , 
            jobTitle : jobTitle , 
            recruiterName: recruiterName || 'HR Team' , 
            companyName : companyName || 'our company' , 
            questions : JSON.stringify(questions) , 
        }

        const conversationPayload = {
            conversations: [{
              agentId: AGENT_ID,
              conversationType: 'telephony',
              toPhoneNumber: candidatePhone,
              dynamicVariables
            }]
          };

          const response = await axios.post(
            `${ORATION_BASE_URL}/conversations`,
            conversationPayload,
            { headers: orationHeaders }
          );

          if (response.data.results && response.data.results.length > 0) {
            const conversation = response.data.results[0];
            console.log(conversation)
            // Save interview record to your database
            const interview = await prisma.interview.create({
              data:{
                id: conversation.conversation.id , 
                jobPostingId : jobId , 
                candidateId , 
                status : 'SCHEDULED' , 
                scheduedAt: new Date() , 
                orationResponse : conversation
              }
            })

            

            return res.status(200).json({
                success: true,
                message: 'Interview initiated successfully',
                data: {
                  interviewId: conversation.id,
                  conversationId: conversation.conversation.id,
                  status: conversation.conversationStatus,
                  candidateName,
                  candidatePhone,
                  startTime: conversation.callStartTime
                }
              });
            } else {
              throw new Error('Failed to create conversation');
            }

    }catch(error){
        //@ts-ignore
        console.error('Error conducting interview:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to initiate interview',
      //@ts-ignore
      error: error.response?.data || error.message
    });
    }
}


export const get_interview_status = async(req : Request , res : Response)=>{
  try{
    const{interviewId} = req.params; 
    console.log(interviewId) ; 
    const interview = await prisma.interview.findUnique({
      where:{id: interviewId}
    })
    // console.log(interview) ; 
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    const response = await axios.get(
      `${ORATION_BASE_URL}/conversations/${interviewId}`,
      { headers: orationHeaders }
    );

    const updatedStatus = response.data?.conversationStatus || interview.status;
    console.log(updatedStatus) ; 
    await prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: updatedStatus,
        startedAt: response.data.callStartTime ? new Date(response.data.callStartTime) : interview.startedAt,
        completedAt: response.data.callEndTime ? new Date(response.data.callEndTime) : interview.completedAt,
        calRecordingUrl: response.data.callRecordingUrl || interview.calRecordingUrl,
        orationResponse: response.data
      }
    });

    
    return res.json({
      success: true,
      data: { ...interview, status: updatedStatus }
    });
    
  }catch(err){
    console.error('Error getting interview status' , err); 

    return res.status(500).json({
      success : false , 
      message:'Failed to fetch interview status', 
      error : err
    })
  }
}

export const finalize_interview = async(req:Request , res:Response)=>{

  try{

    const { interviewId, results } = req.body;
    for (const r of results) {
      await prisma.interviewResponse.create({
        data: {
          interviewId,
          questionId: r.questionId,
          answer: r.answer,
          duration: r.duration,
          score: r.score,
          overallRating: r.rating,
          feedback: r.feedback,
          keywords: r.keywords,
          sentiment: r.sentiment,
          confidence: r.confidence
        }
      });
    }

    

  }catch (error) {
    console.error('Error finalizing interview:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to finalize interview',
      error: error
    });
  }
}