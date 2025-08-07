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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuestion = exports.updateQuestion = exports.getQuestions = exports.addQuestion = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const addQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("reached here or not");
    try {
        const { jobId } = req.params;
        console.log(jobId);
        const { questionText, category, difficulty, expectedAnswer, keywords, maxDuration, order } = req.body;
        const question = yield prisma.question.create({
            data: {
                questionText,
                category,
                difficulty,
                expectedAnswer,
                keywords,
                maxDuration,
                order,
                jobPostingId: jobId
            }
        });
        res.status(201).json({ message: 'Question created successfully', question });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to create question', details: err });
    }
});
exports.addQuestion = addQuestion;
// Get all questions for a job
const getQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobId } = req.params;
    try {
        const questions = yield prisma.question.findMany({
            where: { jobPostingId: jobId },
            orderBy: { order: 'asc' },
        });
        res.status(200).json({ questions });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to get questions', detail: err });
    }
});
exports.getQuestions = getQuestions;
// Update a question
const updateQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const updated = yield prisma.question.update({
            where: { id },
            data: updateData,
        });
        res.status(200).json({ message: "Question updated", updated });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update question", detail: err });
    }
});
exports.updateQuestion = updateQuestion;
//Delete a question 
const deleteQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.question.delete({ where: { id } });
        res.status(200).json({ message: "Question deleted" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete Question", detail: err });
    }
});
exports.deleteQuestion = deleteQuestion;
