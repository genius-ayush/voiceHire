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
exports.deleteJob = exports.updateJobs = exports.getJobById = exports.getJobs = exports.createJob = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, requirements, location, salaryRange, experienceLevel, department } = req.body;
        const recruiterId = req.headers["recruiterId"];
        if (typeof recruiterId !== "string") {
            return res.status(400).json({ message: "Invalid recruiter ID" });
        }
        const job = yield prisma.jobPosting.create({
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
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to create job', err });
    }
});
exports.createJob = createJob;
const getJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recruiterId = req.headers["recruiterId"];
        if (typeof recruiterId !== "string") {
            return res.status(400).json({ message: "Invalid recruiter ID" });
        }
        const jobs = yield prisma.jobPosting.findMany({
            where: { recruiterId },
        });
        res.status(200).json(jobs);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch jobs", err });
    }
});
exports.getJobs = getJobs;
const getJobById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const job = yield prisma.jobPosting.findUnique({
            where: { id: req.params.id },
        });
        if (!job)
            return res.status(404).json({ error: 'Job not found' });
        res.status(200).json(job);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch job', err });
    }
});
exports.getJobById = getJobById;
const updateJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const job = yield prisma.jobPosting.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.status(200).json(job);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to update job', err });
    }
});
exports.updateJobs = updateJobs;
const deleteJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.jobPosting.delete({
            where: { id: req.params.id },
        });
        res.status(200).json({ message: 'Job deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete job', err });
    }
});
exports.deleteJob = deleteJob;
