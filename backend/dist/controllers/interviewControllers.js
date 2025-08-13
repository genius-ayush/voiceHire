"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.interview_status = exports.conduct_interview = exports.conductInterview = void 0;
const axios_1 = __importDefault(require("axios"));
require('dotenv').config();
const API_KEY = process.env.API_KEY;
const WORKSPACE_ID = process.env.WORKSPACE_ID;
const AGENT_ID = process.env.AGENT_ID;
const ORATION_BASE_URL = 'https://www.oration.ai/api/v2';
const orationHeaders = {
    'x-api-key': API_KEY,
    'x-workspace-id': WORKSPACE_ID,
    'Content-Type': 'application/json'
};
const conductInterview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const recruiterId = req.headers["recruiterId"];
    if (typeof recruiterId !== "string") {
        return res.status(400).json({ message: "Invalid recruiter ID" });
    }
    // const {jobId , candidateId} = req.body ; 
    const { candidate_info, questions, interviewr_info, job_info } = req.body;
    const dynamicVariables = {
        "candidate_info": {
            "name": candidate_info.name,
            "email": candidate_info.email,
            "phoneNumber": candidate_info.phoneNumber,
            "experience": candidate_info.experience,
            "skills": candidate_info.skills
        },
        "job_info": {
            "title": job_info.title,
            "jobDescription": job_info.description
        },
        "questions": questions,
        "interviewr_info": {
            "name": interviewr_info.name,
        },
    };
    console.log("agentId", AGENT_ID);
    console.log("apikey", API_KEY);
    console.log("workspaceId", WORKSPACE_ID);
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
    try {
        const response = yield axios_1.default.post(url, data, { headers });
        console.log("✅ Call triggered successfully:");
        console.log(JSON.stringify(response.data, null, 2));
    }
    catch (error) {
        console.error("❌ Failed to trigger call:", error);
        //@ts-ignore
        if (error.response) {
            //@ts-ignore
            console.error(error.response.data);
        }
        else {
            //@ts-ignore
            console.error(error.message);
        }
    }
    //conducting interview based on that info
    // orationai... 
    // save the result ; 
});
exports.conductInterview = conductInterview;
const conduct_interview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { jobId, candidateId, candidatePhone, candidateName, jobTitle, questions, recruiterName, companyName } = req.body;
        console.log(candidatePhone);
        if (!jobId || !candidateId || !candidatePhone || !candidateName || !questions) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: jobId, candidateId, candidatePhone, candidateName, questions'
            });
        }
        const dynamicVariables = {
            candidateName,
            jobTitle: jobTitle,
            recruiterName: recruiterName || 'HR Team',
            companyName: companyName || 'our company',
            questions: JSON.stringify(questions),
        };
        const conversationPayload = {
            conversations: [{
                    agentId: AGENT_ID,
                    conversationType: 'telephony',
                    toPhoneNumber: candidatePhone,
                    dynamicVariables
                }]
        };
        const response = yield axios_1.default.post(`${ORATION_BASE_URL}/conversations`, conversationPayload, { headers: orationHeaders });
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
                questions: questions,
                orationResponse: conversation
            };
            console.log(conversation.conversation.id);
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
        }
        else {
            throw new Error('Failed to create conversation');
        }
    }
    catch (error) {
        //@ts-ignore
        console.error('Error conducting interview:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to initiate interview',
            //@ts-ignore
            error: ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message
        });
    }
});
exports.conduct_interview = conduct_interview;
const interview_status = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e;
    try {
        const { conversationId } = req.params;
        if (!conversationId) {
            return res.status(400).json({
                success: false,
                message: 'Conversation ID is required'
            });
        }
        const response = yield axios_1.default.get(`${ORATION_BASE_URL}/conversations/${conversationId}`, { headers: orationHeaders });
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
    }
    catch (error) {
        //@ts-ignore
        console.error('Error getting interview status:', ((_c = error.response) === null || _c === void 0 ? void 0 : _c.data) || error.message);
        //@ts-ignore
        if (((_d = error.response) === null || _d === void 0 ? void 0 : _d.status) === 404) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Failed to get interview status',
            //@ts-ignore
            error: ((_e = error.response) === null || _e === void 0 ? void 0 : _e.data) || error.message
        });
    }
});
exports.interview_status = interview_status;
