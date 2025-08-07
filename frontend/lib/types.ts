export enum CandidateStatus {
    APPLIED = "APPLIED",
    SCREENING = "SCREENING",
    INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED",
    INTERVIEWED = "INTERVIEWED",
    SELECTED = "SELECTED",
    REJECTED = "REJECTED",
    HIRED = "HIRED",
  }
  
  export enum Difficulty {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD",
  }
  
  export interface Recruiter {
    id: string
    name: string
    email: string
    avatar?: string
    password: string
    company?: string
    createdAt: string
    updatedAt: string
    jobPostings: JobPosting[]
  }
  
  export interface JobPosting {
    id: string
    title: string
    description: string
    requirements?: string
    location?: string
    salaryRange?: string
    experienceLevel?: string
    department?: string
    isActive: boolean
    createdAt: string
    updatedAt: string
    recruiterId: string
    recruiter: Recruiter
    candidates: Candidate[]
    questions: Question[]
    interviews: Interview[]
  }
  
  export interface Candidate {
    id: string
    name: string
    email: string
    phoneNo: string
    resume?: string
    experience?: string
    skills: string[]
    currentCompany?: string
    currentRole?: string
    expectedSalary?: string
    noticePeriod?: string
    location?: string
    status: CandidateStatus
    appliedAt: string
    updatedAt: string
    jobPostingId: string
    jobPosting: JobPosting
    interviews: Interview[]
  }
  
  export interface Question {
    id: string
    questionText: string
    category?: string
    difficulty: Difficulty
    expectedAnswer?: string
    keywords: string[]
    maxDuration?: number
    order?: number
    isActive: boolean
    createdAt: string
    updatedAt: string
    jobPostingId: string
    jobPosting: JobPosting
    responses: InterviewResponse[]
  }
  
  export interface Interview {
    id: string
    scheduledAt: string
    startedAt?: string
    completedAt?: string
    status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
    overallScore?: number
    feedback?: string
    createdAt: string
    updatedAt: string
    candidateId: string
    jobPostingId: string
    candidate: Candidate
    jobPosting: JobPosting
    responses: InterviewResponse[]
  }
  
  export interface InterviewResponse {
    id: string
    answer: string
    score?: number
    feedback?: string
    duration: number
    createdAt: string
    interviewId: string
    questionId: string
    interview: Interview
    question: Question
  }
  