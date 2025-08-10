"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Play, Clock, Mic, MicOff, Phone, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import type { Candidate, Question } from "@/lib/types"
import axios from "axios"

interface InterviewState {
  status: "waiting" | "in_progress" | "completed"
  currentQuestionIndex: number
  timeRemaining: number
  isRecording: boolean
  responses: Array<{
    questionId: string
    answer: string
    duration: number
    score?: number
  }>
}

export default function InterviewPage() {
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [interview, setInterview] = useState<InterviewState>({
    status: "waiting",
    currentQuestionIndex: 0,
    timeRemaining: 0,
    isRecording: false,
    responses: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        // console.log(params) ; 
        const candidateId = params.candidateId ; 
        const jobId = params.id ; 
        const token = localStorage.getItem("token") ; 

        const candidate_info = await axios.get(`http://localhost:5000/candidates/candidates/${candidateId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const questions = await axios.get(`http://localhost:5000/questions/jobs/${jobId}/questions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const interviewer_info = await axios.get(`http://localhost:5000/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        console.log(candidate_info) ; 
        console.log(questions); 
        console.log(interviewer_info) ; 
        // Mock candidate data
        const mockCandidate: Candidate = {
          id: params.candidateId as string,
          name: "Sarah Johnson",
          email: "sarah.johnson@email.com",
          phoneNo: "+1234567890",
          experience: "6 years",
          skills: ["React", "TypeScript", "Node.js", "GraphQL"],
          currentCompany: "Tech Corp",
          currentRole: "Frontend Developer",
          expectedSalary: "$120,000",
          noticePeriod: "2 weeks",
          location: "San Francisco, CA",
          status: "INTERVIEW_SCHEDULED" as any,
          appliedAt: "2024-01-20T10:00:00Z",
          updatedAt: "2024-01-20T10:00:00Z",
          jobPostingId: params.id as string,
          jobPosting: {} as any,
          interviews: [],
        }

        // Mock questions
        const mockQuestions: Question[] = [
          {
            id: "q1",
            questionText: "Tell me about yourself and your experience with React.",
            category: "Behavioral",
            difficulty: "EASY" as any,
            expectedAnswer: "Look for relevant experience, passion for technology, and communication skills.",
            keywords: ["react", "experience", "background"],
            maxDuration: 120,
            order: 1,
            isActive: true,
            createdAt: "2024-01-15T10:00:00Z",
            updatedAt: "2024-01-15T10:00:00Z",
            jobPostingId: params.id as string,
            jobPosting: {} as any,
            responses: [],
          },
          {
            id: "q2",
            questionText: "What is the difference between let, const, and var in JavaScript?",
            category: "Technical",
            difficulty: "MEDIUM" as any,
            expectedAnswer:
              "let and const are block-scoped, while var is function-scoped. const cannot be reassigned after declaration.",
            keywords: ["javascript", "variables", "scope"],
            maxDuration: 180,
            order: 2,
            isActive: true,
            createdAt: "2024-01-15T10:00:00Z",
            updatedAt: "2024-01-15T10:00:00Z",
            jobPostingId: params.id as string,
            jobPosting: {} as any,
            responses: [],
          },
          {
            id: "q3",
            questionText: "Describe a challenging project you worked on and how you overcame the difficulties.",
            category: "Behavioral",
            difficulty: "MEDIUM" as any,
            expectedAnswer: "Look for problem-solving skills, teamwork, and learning from challenges.",
            keywords: ["project", "challenges", "problem-solving"],
            maxDuration: 240,
            order: 3,
            isActive: true,
            createdAt: "2024-01-15T10:00:00Z",
            updatedAt: "2024-01-15T10:00:00Z",
            jobPostingId: params.id as string,
            jobPosting: {} as any,
            responses: [],
          },
        ]

        setCandidate(candidate_info.data)
        setQuestions(questions.data)
        setInterview((prev) => ({
          ...prev,
          timeRemaining: mockQuestions[0]?.maxDuration || 120,
        }))
      } catch (error) {
        console.error("Failed to fetch interview data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, params.candidateId])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (interview.status === "in_progress" && interview.timeRemaining > 0) {
      interval = setInterval(() => {
        setInterview((prev) => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }))
      }, 1000)
    } else if (interview.timeRemaining === 0 && interview.status === "in_progress") {
      handleNextQuestion()
    }

    return () => clearInterval(interval)
  }, [interview.status, interview.timeRemaining])

  const startInterview = () => {
    setInterview((prev) => ({
      ...prev,
      status: "in_progress",
      timeRemaining: questions[0]?.maxDuration || 120,
    }))
  }

  const handleNextQuestion = () => {
    const currentQuestion = questions[interview.currentQuestionIndex]

    // Simulate recording the response
    const mockResponse = {
      questionId: currentQuestion.id,
      answer: "Mock answer recorded for: " + currentQuestion.questionText,
      duration: (currentQuestion.maxDuration || 120) - interview.timeRemaining,
      score: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
    }

    setInterview((prev) => ({
      ...prev,
      responses: [...prev.responses, mockResponse],
      isRecording: false,
    }))

    if (interview.currentQuestionIndex < questions.length - 1) {
      const nextQuestion = questions[interview.currentQuestionIndex + 1]
      setInterview((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        timeRemaining: nextQuestion.maxDuration || 120,
      }))
    } else {
      completeInterview()
    }
  }

  const completeInterview = async () => {
    setInterview((prev) => ({
      ...prev,
      status: "completed",
    }))

    // Simulate processing results
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Navigate to results
    router.push(`/dashboard/jobs/${params.id}/interview/${params.candidateId}/results`)
  }

  const toggleRecording = () => {
    setInterview((prev) => ({
      ...prev,
      isRecording: !prev.isRecording,
    }))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!candidate || !questions.length) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">Interview not found</h3>
            <p className="text-muted-foreground mb-6">Unable to load interview data.</p>
            <Link href={`/dashboard/jobs/${params.id}`}>
              <Button>Back to Job</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[interview.currentQuestionIndex]
  const progress =
    ((interview.currentQuestionIndex + (interview.status === "completed" ? 1 : 0)) / questions.length) * 100

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href={`/dashboard/jobs/${params.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Job
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Telephonic Interview</h1>
          <p className="text-muted-foreground mt-1">AI-powered interview simulation</p>
        </div>
      </div>

      {/* Interview Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{candidate.name}</CardTitle>
                <CardDescription>{candidate.email}</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-2xl font-bold">{Math.round(progress)}%</p>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>
              Question {interview.currentQuestionIndex + 1} of {questions.length}
            </span>
            <span>{interview.responses.length} completed</span>
          </div>
        </CardHeader>
      </Card>

      {/* Interview Status */}
      {interview.status === "waiting" && (
        <Card>
          <CardContent className="p-12 text-center">
            <Phone className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Ready to Start Interview</h2>
            <p className="text-muted-foreground mb-8">
              This interview will consist of {questions.length} questions. Each question has a time limit and will be
              automatically recorded.
            </p>
            <Button size="lg" onClick={startInterview}>
              <Play className="h-5 w-5 mr-2" />
              Start Interview
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active Interview */}
      {interview.status === "in_progress" && currentQuestion && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>Question {interview.currentQuestionIndex + 1}</span>
                  <Badge variant="outline">{currentQuestion.category}</Badge>
                  <Badge
                    variant={
                      currentQuestion.difficulty === "EASY"
                        ? "default"
                        : currentQuestion.difficulty === "MEDIUM"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {currentQuestion.difficulty}
                  </Badge>
                </CardTitle>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-lg font-mono">
                  <Clock className="h-5 w-5" />
                  <span className={interview.timeRemaining <= 30 ? "text-destructive" : ""}>
                    {formatTime(interview.timeRemaining)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {interview.isRecording ? (
                    <div className="flex items-center space-x-2 text-red-500">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Recording</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Not recording</span>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Question:</h3>
                <p className="text-lg leading-relaxed">{currentQuestion.questionText}</p>
              </div>

              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant={interview.isRecording ? "destructive" : "default"}
                  size="lg"
                  onClick={toggleRecording}
                  className="px-8"
                >
                  {interview.isRecording ? (
                    <>
                      <MicOff className="h-5 w-5 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="h-5 w-5 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleNextQuestion}>
                  Skip Question
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Speak clearly and provide detailed answers. The AI will analyze your response.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interview Completed */}
      {interview.status === "completed" && (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Interview Completed!</h2>
            <p className="text-muted-foreground mb-8">
              Thank you for completing the interview. Your responses are being processed by our AI system.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{questions.length}</p>
                <p className="text-sm text-muted-foreground">Questions Answered</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {Math.round(interview.responses.reduce((sum, r) => sum + r.duration, 0) / 60)}m
                </p>
                <p className="text-sm text-muted-foreground">Total Duration</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {Math.round(
                    interview.responses.reduce((sum, r) => sum + (r.score || 0), 0) / interview.responses.length,
                  )}
                  %
                </p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <Link href={`/dashboard/jobs/${params.id}/interview/${params.candidateId}/results`}>
                <Button size="lg">View Results</Button>
              </Link>
              <Link href={`/dashboard/jobs/${params.id}`}>
                <Button variant="outline" size="lg">
                  Back to Job
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Question List */}
      <Card>
        <CardHeader>
          <CardTitle>Interview Questions</CardTitle>
          <CardDescription>Overview of all questions in this interview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {questions.map((question, index) => {
              const isCompleted = index < interview.currentQuestionIndex || interview.status === "completed"
              const isCurrent = index === interview.currentQuestionIndex && interview.status === "in_progress"
              const response = interview.responses.find((r) => r.questionId === question.id)

              return (
                <div
                  key={question.id}
                  className={`flex items-center space-x-4 p-4 rounded-lg border ${
                    isCurrent
                      ? "border-primary bg-primary/5"
                      : isCompleted
                        ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                        : "border-border"
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : isCurrent ? (
                      <div className="w-5 h-5 border-2 border-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-muted-foreground rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">Question {index + 1}</span>
                      <Badge variant="outline" className="text-xs">
                        {question.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {question.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{question.questionText}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{question.maxDuration}s</span>
                    </div>
                    {response && (
                      <div className="text-sm font-medium text-green-600 mt-1">Score: {response.score}%</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
