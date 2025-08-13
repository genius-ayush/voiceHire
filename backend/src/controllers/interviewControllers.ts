import axios from "axios";
require('dotenv').config();
import { Request, Response } from "express";
const API_KEY = process.env.API_KEY;
const WORKSPACE_ID = process.env.WORKSPACE_ID;
const AGENT_ID = process.env.AGENT_ID;
const ORATION_BASE_URL = 'https://www.oration.ai/api/v2';


const orationHeaders = {
    'x-api-key': API_KEY,
    'x-workspace-id': WORKSPACE_ID,
    'Content-Type': 'application/json'
  };

export const conductInterview = async(req:Request , res : Response)=>{

    const recruiterId = req.headers["recruiterId"];

    if (typeof recruiterId !== "string") {
        return res.status(400).json({ message: "Invalid recruiter ID" })
    }

    // const {jobId , candidateId} = req.body ; 
    const {candidate_info , questions , interviewr_info , job_info} = req.body ;    
    
    const dynamicVariables = {

        "candidate_info" : {
            "name" : candidate_info.name , 
            "email" : candidate_info.email , 
            "phoneNumber" : candidate_info.phoneNumber , 
            "experience" : candidate_info.experience , 
            "skills" : candidate_info.skills
        }  , 
        "job_info" : {
            "title" : job_info.title  , 
            "jobDescription" : job_info.description
        } , 
        "questions":questions  , 
        "interviewr_info" : {
            "name" : interviewr_info.name , 

        } ,
    }

    console.log("agentId" , AGENT_ID) ; 
    console.log("apikey" , API_KEY) ; 
    console.log("workspaceId" , WORKSPACE_ID)
    // console.log(candidate_info)
    // console.log(questions) ; 
    // console.log(interviewr_info) ; 
    // console.log(job_info) ; 
    // console.log(typeof(candidate_info.phoneNo))
    const url = "https://www.oration.ai/api/v2/conversations";

    const data = {
        conversations: [
          {
            agentId: AGENT_ID,
            conversationType: "telephony",
            toPhoneNumber: candidate_info.phoneNumber,
            dynamicVariables: ""
          }
        ]
      };

          const headers = {
            "x-api-key": API_KEY,
            "x-workspace-id": WORKSPACE_ID,
            "Content-Type": "application/json"
          };

    try{
        
        const response = await axios.post(url, data, { headers });
    console.log("✅ Call triggered successfully:");
    console.log(JSON.stringify(response.data, null, 2));

    }catch (error) {
        console.error("❌ Failed to trigger call:" , error);
        //@ts-ignore
        if (error.response) {
            //@ts-ignore
          console.error(error.response.data);
        } else {
            //@ts-ignore
          console.error(error.message);
        }
      }
    //conducting interview based on that info

    // orationai... 

    // save the result ; 


}

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

        console.log(candidatePhone)  ;

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
            
            // Save interview record to your database
            const interviewRecord = {
              jobId,
              candidateId,
              conversationId: conversation.id,
              candidateName,
              candidatePhone,
              status: 'initiated',
              startTime: new Date(),
              questions: questions , 
              orationResponse: conversation
            };

            console.log(conversation.conversation.id) ; 
            return res.status(200).json({
                success: true,
                message: 'Interview initiated successfully',
                data: {
                  interviewId: conversation.id,
                  conversationId: conversation.id,
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

export const interview_status = async(req:Request , res: Response)=>{
   try{
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: 'Conversation ID is required'
      });
    }

    const response = await axios.get(
      `${ORATION_BASE_URL}/conversations/${conversationId}`,
      { headers: orationHeaders }
    );
    const conversation = response.data;

    const interviewStatus = {
      conversationId: conversation.id,
      status: conversation.conversationStatus,
      telephonyStatus: conversation.telephonyStatus,
      startTime: conversation.callStartTime,
      endTime: conversation.callEndTime,
      userJoinTime: conversation.userJoinTime,
      userLeaveTime: conversation.userLeaveTime,
      endReason: conversation.endReason,
      duration: conversation.callEndTime && conversation.callStartTime 
      //@ts-ignore
        ? Math.round((new Date(conversation.callEndTime) - new Date(conversation.callStartTime)) / 1000)
        : null,
      summary: conversation.summary,
      recordingStatus: conversation.recordingStatus
    };

    return res.status(200).json({
      success: true,
      data: interviewStatus
    });

   }catch(error){
    //@ts-ignore
    console.error('Error getting interview status:', error.response?.data || error.message);
    
    //@ts-ignore
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to get interview status',
      //@ts-ignore
      error: error.response?.data || error.message
    });
   }
}