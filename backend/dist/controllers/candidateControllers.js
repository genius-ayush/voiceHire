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
exports.deleteCandidate = exports.updateCandidate = exports.getCandidate = exports.listCandidates = exports.addCandidate = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const addCandidate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobId } = req.params;
    try {
        const candidate = yield prisma.candidate.create({
            data: Object.assign(Object.assign({}, req.body), { jobPostingId: jobId })
        });
        return res.status(201).json(candidate);
    }
    catch (err) {
        return res.status(500).json({ message: 'Error creating candidate', err });
    }
});
exports.addCandidate = addCandidate;
const listCandidates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobId } = req.params;
    try {
        const candidates = yield prisma.candidate.findMany({
            where: { jobPostingId: jobId },
            orderBy: { appliedAt: 'desc' },
        });
        return res.json(candidates);
    }
    catch (err) {
        return res.status(500).json({ message: 'Error fetching candidates', err });
    }
});
exports.listCandidates = listCandidates;
const getCandidate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const candidate = yield prisma.candidate.findUnique({
            where: { id: req.params.id },
        });
        if (!candidate)
            return res.status(404).json({ message: 'Candidate not found' });
        return res.json(candidate);
    }
    catch (err) {
        return res.status(500).json({ message: 'Error fetching candidate', err });
    }
});
exports.getCandidate = getCandidate;
const updateCandidate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const candidate = yield prisma.candidate.update({
            where: { id: req.params.id },
            data: req.body,
        });
        return res.json(candidate);
    }
    catch (err) {
        return res.status(500).json({ message: 'Error updating candidate', err });
    }
});
exports.updateCandidate = updateCandidate;
const deleteCandidate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.candidate.delete({
            where: { id: req.params.id },
        });
        return res.status(204).send();
    }
    catch (err) {
        return res.status(500).json({ message: 'Error deleting candidate', err });
    }
});
exports.deleteCandidate = deleteCandidate;
