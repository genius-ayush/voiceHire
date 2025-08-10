import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken'
import { SECRET } from "../middlewares";
const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {

    const { name, email, password } = req.body;
    try {

        const existingRecruiter = await prisma.recruiter.findUnique({ where: { email } });
        if (existingRecruiter) {
            return res.status(400).json({ message: 'Recruiter already exist' });
        }

        const newRecruiter = await prisma.recruiter.create({ data: { name, email, password } });
        const token = jwt.sign({ id: newRecruiter.id }, SECRET, { expiresIn: '1h' })
        return res.status(201).json({ token, id: newRecruiter.id })

    } catch (err) {
        res.status(500).json({ error: 'Registeration failed', err });
    }
}

export const login = async (req: Request, res: Response) => {

    const { email, password } = req.body;
    try {

        const recruiter = await prisma.recruiter.findFirst({ where: { email, password } })
        console.log(recruiter);

        if (recruiter) {
            const token = jwt.sign({ id: recruiter.id }, SECRET, { expiresIn: '1h' });
            res.json({ message: 'Logged in Successfully', token, id: recruiter.id });
        } else {
            res.status(403).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Login failed', err })
    }
}

export const me = async (req: Request, res: Response) => {

    const recruiterId = req.headers["recruiterId"];

    if (typeof recruiterId !== "string") {
        return res.status(400).json({ message: "Invalid recruiter ID" })
    }


    try {

        const recruiter = await prisma.recruiter.findUnique({ where: { id: recruiterId } });

        if (recruiter) {
            res.json({ recruiter })
        } else {
            res.status(403).json({ message: 'recruter not loggedIn' });
        }
    } catch (err) {
        console.log(err);
    }
}

export const stats = async (req: Request, res: Response) => {
    const recruiterId = req.headers["recruiterId"];
    // console.log(recruiterId); 

    if (typeof recruiterId !== "string") {
        return res.status(400).json({ message: "Invalid recruiter ID" });
    }

    try {
        // Get recruiter info + counts + recent interviews
        const recruiter = await prisma.recruiter.findUnique({
            where: { id: recruiterId },
            include: {
                jobPostings: {
                    include: {
                        candidates: true,
                        questions: true,
                        interviews: {
                            orderBy: { createdAt: "desc" },
                            take: 5,
                        },
                    },
                },
            },
        });

        if (!recruiter) {
            return res.status(403).json({ message: "Recruiter not logged in" });
        }

        // Calculate counts
        const totalJobs = recruiter.jobPostings.length;
        const totalCandidates = recruiter.jobPostings.reduce(
            (sum, job) => sum + job.candidates.length,
            0
        );
        const totalQuestions = recruiter.jobPostings.reduce(
            (sum, job) => sum + job.questions.length,
            0
        );

        const recentInterviews = recruiter.jobPostings
            .flatMap((job) => job.interviews)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 5); // Limit to 5 recent interviews

        return res.json({
            recruiter: {
                id: recruiter.id,
                name: recruiter.name,
                email: recruiter.email,
                avatar: recruiter.avatar,
                company: recruiter.company,
                createdAt: recruiter.createdAt,
            },
            stats: {
                totalJobs,
                totalCandidates,
                totalQuestions,
                recentInterviews,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}
