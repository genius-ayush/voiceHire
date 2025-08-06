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
exports.me = exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middlewares_1 = require("../middlewares");
const prisma = new client_1.PrismaClient();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const existingRecruiter = yield prisma.recruiter.findUnique({ where: { email } });
        if (existingRecruiter) {
            return res.status(400).json({ message: 'Recruiter already exist' });
        }
        const newRecruiter = yield prisma.recruiter.create({ data: { name, email, password } });
        const token = jsonwebtoken_1.default.sign({ id: newRecruiter.id }, middlewares_1.SECRET, { expiresIn: '1h' });
        return res.status(201).json({ token, id: newRecruiter.id });
    }
    catch (err) {
        res.status(500).json({ error: 'Registeration failed', err });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(email);
    console.log(password);
    try {
        const recruiter = yield prisma.recruiter.findFirst({ where: { email, password } });
        console.log(recruiter);
        if (recruiter) {
            const token = jsonwebtoken_1.default.sign({ id: recruiter.id }, middlewares_1.SECRET, { expiresIn: '1h' });
            res.json({ message: 'Logged in Successfully', token, id: recruiter.id });
        }
        else {
            res.status(403).json({ message: 'Invalid email or password' });
        }
    }
    catch (err) {
        res.status(500).json({ error: 'Login failed', err });
    }
});
exports.login = login;
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const recruiterId = req.headers["recruiterId"];
    if (typeof recruiterId !== "string") {
        return res.status(400).json({ message: "Invalid recruiter ID" });
    }
    try {
        const recruiter = yield prisma.recruiter.findUnique({ where: { id: recruiterId } });
        if (recruiter) {
            res.json({ recruiter: recruiter.name, email: recruiter.email, recruiterId });
        }
        else {
            res.status(403).json({ message: 'recruter not loggedIn' });
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.me = me;
