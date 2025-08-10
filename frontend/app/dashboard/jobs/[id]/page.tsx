"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Plus,
  Edit,
  Trash2,
  MessageSquare,
  Clock,
  Tag,
  Users,
  Phone,
  Mail,
  Building,
  DollarSign,
  Play,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { z } from "zod"
import type { JobPosting, Candidate, Question, CandidateStatus, Difficulty } from "@/lib/types"
import axios from "axios"

const candidateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNo: z.string().min(10, "Phone number must be at least 10 digits"),
  experience: z.string().optional(),
  skills: z.array(z.string().min(1)).min(1, "At least one skill is required"),
  currentCompany: z.string().optional(),
  currentRole: z.string().optional(),
  expectedSalary: z.string().optional(),
  noticePeriod: z.string().optional(),
  location: z.string().optional(),
})


const questionSchema = z.object({
  questionText: z.string().min(10, "Question must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
  keywords: z.array(z.string().min(1)).min(1, "At least one keyword is required"),
  maxDuration: z.number().min(30, "Duration must be at least 30 seconds"),
  expectedAnswer: z.string().min(10, "Expected answer must be at least 10 characters"),
});


export default function JobDetailsPage() {
  const [job, setJob] = useState<JobPosting | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingCandidate, setIsAddingCandidate] = useState(false)
  const [isAddingQuestion, setIsAddingQuestion] = useState(false)
  const [candidateDialogOpen, setCandidateDialogOpen] = useState(false)
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const params = useParams()
  const router = useRouter()
  const jobId = useParams() ;
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // API calls
        
        const token = localStorage.getItem("token") ; 

        if (!token) {
            console.error('No token found');
            return;
          } 
        
        setIsLoading(true) ; 
           
        try{
            
            const job_res = await axios.get(`http://localhost:5000/jobPostings/jobs/${jobId.id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })

            const candi_res = await axios.get(`http://localhost:5000/candidates/jobs/${jobId.id}/candidates`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })

            const ques_res = await axios.get(`http://localhost:5000/questions/jobs/${jobId.id}/questions`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })

            setJob(job_res.data)
            setCandidates(candi_res.data)
            setQuestions(ques_res.data.questions)
        }catch(error){
            console.error('Error fetching data' , error) ; 
        }
      } catch (error) {
        console.error("Failed to fetch job details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobDetails()
  }, [params.id])

  const handleAddCandidate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsAddingCandidate(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phoneNo: formData.get("phoneNo") as string,
      experience: formData.get("experience") as string,
      skills: (formData.get("skills") as string)
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0),
      currentCompany: formData.get("currentCompany") as string,
      currentRole: formData.get("currentRole") as string,
      expectedSalary: formData.get("expectedSalary") as string,
      noticePeriod: formData.get("noticePeriod") as string,
      location: formData.get("location") as string,
    }

    try {
      const result = candidateSchema.parse(data)

      console.log(result) ; 
      
      const token = localStorage.getItem("token"); 

      if(!token){
        throw new Error("Authenticate token not found")
      }

      const response = await axios.post(`http://localhost:5000/candidates/jobs/${jobId.id}/candidates` , result , {headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },})

      setCandidates([...candidates, response.data])
      setCandidateDialogOpen(false)
      e.currentTarget.reset()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
      }
    } finally {
      setIsAddingCandidate(false)
    }
  }

  const handleAddQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsAddingQuestion(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)

    
    const data = {
      questionText: formData.get("questionText") as string,
      category: formData.get("category") as string,
      difficulty: formData.get("difficulty") as string,
      keywords: (formData.get("keywords") as string)
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0),
      maxDuration: Number.parseInt(formData.get("maxDuration") as string),
      expectedAnswer: formData.get("expectedAnswer") as string,
    }
    

    

    try {
      const result = questionSchema.parse(data)
      console.log(result) ; 


      const token = localStorage.getItem("token") ; 

      if(!token){
        throw new Error("Authenticate token not found")
      }

      const response = await axios.post(`http://localhost:5000/questions/jobs/${jobId.id}/questions` , result , {headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },})
      
      
      setQuestions([...questions, response.data.question])
      setQuestionDialogOpen(false)
      e.currentTarget.reset()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
      }
    } finally {
      setIsAddingQuestion(false)
    }
  }

  const handleStartInterview = async (candidateId: string) => {
    // Simulate starting interview
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update candidate status
    setCandidates(
      candidates.map((c) => (c.id === candidateId ? { ...c, status: "INTERVIEW_SCHEDULED" as CandidateStatus } : c)),
    )

    // Navigate to interview simulation
    router.push(`/dashboard/jobs/${params.id}/interview/${candidateId}`)
  }

  const getStatusColor = (status: CandidateStatus) => {
    switch (status) {
      case "APPLIED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "SCREENING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "INTERVIEW_SCHEDULED":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "INTERVIEWED":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
      case "SELECTED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "HIRED":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "HARD":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
          <div className="h-48 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">Job not found</h3>
            <p className="text-muted-foreground mb-6">The job you're looking for doesn't exist.</p>
            <Link href="/dashboard/jobs">
              <Button>Back to Jobs</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/jobs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </Link>
      </div>

      {/* Job Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  {job.department}
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {job.salaryRange}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Created {new Date(job.createdAt).toLocaleDateString()}
                </div>
                <Badge variant={job.isActive ? "default" : "secondary"}>{job.isActive ? "Active" : "Inactive"}</Badge>
                <Badge variant="outline">{job.experienceLevel}</Badge>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Job
              </Button>
              <Link href={`/dashboard/jobs/${job.id}/results`}>
                <Button variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Results
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{job.description}</p>
            </div>

            {job.requirements && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                <div className="text-muted-foreground whitespace-pre-line">{job.requirements}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Candidates and Questions */}
      <Tabs defaultValue="candidates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="candidates" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Candidates ({candidates.length})</span>
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Questions ({questions.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Candidates Tab */}
        <TabsContent value="candidates">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Candidates</CardTitle>
                  <CardDescription>Manage candidates for this job posting</CardDescription>
                </div>
                <Dialog open={candidateDialogOpen} onOpenChange={setCandidateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Candidate
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Candidate</DialogTitle>
                      <DialogDescription>Add a candidate to this job posting</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddCandidate} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input id="name" name="name" required />
                          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input id="email" name="email" type="email" required />
                          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phoneNo">Phone Number *</Label>
                          <Input id="phoneNo" name="phoneNo" required />
                          {errors.phoneNo && <p className="text-sm text-destructive">{errors.phoneNo}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="experience">Experience</Label>
                          <Input id="experience" name="experience" placeholder="e.g. 5 years" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="skills">Skills *</Label>
                        <Input
                          id="skills"
                          name="skills"
                          placeholder="React, TypeScript, Node.js (comma separated)"
                          required
                        />
                        {errors.skills && <p className="text-sm text-destructive">{errors.skills}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentCompany">Current Company</Label>
                          <Input id="currentCompany" name="currentCompany" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="currentRole">Current Role</Label>
                          <Input id="currentRole" name="currentRole" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expectedSalary">Expected Salary</Label>
                          <Input id="expectedSalary" name="expectedSalary" placeholder="$120,000" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="noticePeriod">Notice Period</Label>
                          <Input id="noticePeriod" name="noticePeriod" placeholder="2 weeks" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input id="location" name="location" placeholder="San Francisco, CA" />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setCandidateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isAddingCandidate}>
                          {isAddingCandidate ? "Adding..." : "Add Candidate"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {candidates.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No candidates yet</h3>
                  <p className="text-muted-foreground mb-6">Add your first candidate to get started</p>
                  <Button onClick={() => setCandidateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Candidate
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {candidates.map((candidate) => (
                    <Card key={candidate.id} className="border-border">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {candidate.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold">{candidate.name}</h4>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                                <div className="flex items-center">
                                  <Mail className="h-4 w-4 mr-1" />
                                  {candidate.email}
                                </div>
                                <div className="flex items-center">
                                  <Phone className="h-4 w-4 mr-1" />
                                  {candidate.phoneNo}
                                </div>
                                {candidate.currentCompany && (
                                  <div className="flex items-center">
                                    <Building className="h-4 w-4 mr-1" />
                                    {candidate.currentRole} at {candidate.currentCompany}
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-3">
                                <Badge className={getStatusColor(candidate.status)}>
                                  {candidate.status.replace("_", " ")}
                                </Badge>
                                {candidate.experience && (
                                  <Badge variant="outline">{candidate.experience} experience</Badge>
                                )}
                                {candidate.expectedSalary && (
                                  <Badge variant="outline">{candidate.expectedSalary}</Badge>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {candidate.skills.map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStartInterview(candidate.id)}
                              disabled={candidate.status === "INTERVIEW_SCHEDULED"}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              {candidate.status === "INTERVIEW_SCHEDULED" ? "Scheduled" : "Start Interview"}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Interview Questions</CardTitle>
                  <CardDescription>Manage questions for this job's interviews</CardDescription>
                </div>
                <Dialog open={questionDialogOpen} onOpenChange={setQuestionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Question</DialogTitle>
                      <DialogDescription>Create a new interview question for this job</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddQuestion} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="questionText">Question Text *</Label>
                        <Textarea
                          id="questionText"
                          name="questionText"
                          placeholder="Enter your interview question..."
                          rows={3}
                          required
                        />
                        {errors.questionText && <p className="text-sm text-destructive">{errors.questionText}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category *</Label>
                          <Select name="category" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Technical">Technical</SelectItem>
                              <SelectItem value="Behavioral">Behavioral</SelectItem>
                              <SelectItem value="HR">HR</SelectItem>
                              <SelectItem value="Cultural Fit">Cultural Fit</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="difficulty">Difficulty *</Label>
                          <Select name="difficulty" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EASY">Easy</SelectItem>
                              <SelectItem value="MEDIUM">Medium</SelectItem>
                              <SelectItem value="HARD">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.difficulty && <p className="text-sm text-destructive">{errors.difficulty}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="maxDuration">Max Duration (seconds) *</Label>
                          <Input
                            id="maxDuration"
                            name="maxDuration"
                            type="number"
                            min="30"
                            max="600"
                            placeholder="120"
                            required
                          />
                          {errors.maxDuration && <p className="text-sm text-destructive">{errors.maxDuration}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="keywords">Keywords *</Label>
                        <Input
                          id="keywords"
                          name="keywords"
                          placeholder="javascript, react, frontend (comma separated)"
                          required
                        />
                        {errors.keywords && <p className="text-sm text-destructive">{errors.keywords}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expectedAnswer">Expected Answer *</Label>
                        <Textarea
                          id="expectedAnswer"
                          name="expectedAnswer"
                          placeholder="Describe what you're looking for in a good answer..."
                          rows={4}
                          required
                        />
                        {errors.expectedAnswer && <p className="text-sm text-destructive">{errors.expectedAnswer}</p>}
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setQuestionDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isAddingQuestion}>
                          {isAddingQuestion ? "Adding..." : "Add Question"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {questions.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No questions yet</h3>
                  <p className="text-muted-foreground mb-6">Add your first interview question to get started</p>
                  <Button onClick={() => setQuestionDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Question
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <Card key={question.id} className="border-border">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                              <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                              <Badge variant="outline">{question.category}</Badge>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 mr-1" />
                                {question.maxDuration}s
                              </div>
                            </div>
                            <h4 className="text-lg font-medium mb-3">{question.questionText}</h4>
                            <div className="flex flex-wrap items-center gap-1 mb-3">
                              {question.keywords.map((keyword, keywordIndex) => (
                                <Badge key={keywordIndex} variant="secondary" className="text-xs">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                            <div className="bg-muted p-3 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">Expected Answer:</p>
                              <p className="text-sm">{question.expectedAnswer}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
