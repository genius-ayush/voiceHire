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
exports.finalize_interview = exports.get_interview_status = exports.conduct_interview = void 0;
const axios_1 = __importDefault(require("axios"));
require('dotenv').config();
const API_KEY = process.env.API_KEY;
const WORKSPACE_ID = process.env.WORKSPACE_ID;
const AGENT_ID = process.env.AGENT_ID;
const ORATION_BASE_URL = 'https://www.oration.ai/api/v2';
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const orationHeaders = {
    'x-api-key': API_KEY,
    'x-workspace-id': WORKSPACE_ID,
    'Content-Type': 'application/json'
};
const conduct_interview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { jobId, candidateId, candidatePhone, candidateName, jobTitle, questions, recruiterName, companyName } = req.body;
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
            console.log(conversation);
            // Save interview record to your database
            const interview = yield prisma.interview.create({
                data: {
                    id: conversation.conversation.id,
                    jobPostingId: jobId,
                    candidateId,
                    status: 'SCHEDULED',
                    scheduedAt: new Date(),
                    orationResponse: conversation
                }
            });
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
const get_interview_status = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { interviewId } = req.params;
        console.log(interviewId);
        const interview = yield prisma.interview.findUnique({
            where: { id: interviewId }
        });
        // console.log(interview) ; 
        if (!interview) {
            return res.status(404).json({ success: false, message: 'Interview not found' });
        }
        const response = yield axios_1.default.get(`${ORATION_BASE_URL}/conversations/${interviewId}`, { headers: orationHeaders });
        const updatedStatus = ((_c = response.data) === null || _c === void 0 ? void 0 : _c.conversationStatus) || interview.status;
        console.log(updatedStatus);
        yield prisma.interview.update({
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
            data: Object.assign(Object.assign({}, interview), { status: updatedStatus })
        });
    }
    catch (err) {
        console.error('Error getting interview status', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch interview status',
            error: err
        });
    }
});
exports.get_interview_status = get_interview_status;
const finalize_interview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { interviewId, results } = req.body;
        for (const r of results) {
            yield prisma.interviewResponse.create({
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
    }
    catch (error) {
        console.error('Error finalizing interview:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to finalize interview',
            error: error
        });
    }
});
exports.finalize_interview = finalize_interview;
