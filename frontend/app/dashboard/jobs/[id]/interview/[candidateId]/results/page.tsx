"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Trophy,
  Clock,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Download,
  Share,
  Star,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import type { Candidate } from "@/lib/types"

interface InterviewResult {
  overallScore: number
  technicalScore: number
  behavioralScore: number
  communicationScore: number
  totalDuration: number
  questionsAnswered: number
  strengths: string[]
  improvements: string[]
  responses: Array<{
    questionId: string
    question: string
    answer: string
    score: number
    feedback: string
    duration: number
    keywords: string[]
  }>
  recommendation: "HIRE" | "MAYBE" | "REJECT"
  confidenceLevel: number
}

export default function InterviewResultsPage() {
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [results, setResults] = useState<InterviewResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Simulate API call and AI processing
        await new Promise((resolve) => setTimeout(resolve, 2000))

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
          status: "INTERVIEWED" as any,
          appliedAt: "2024-01-20T10:00:00Z",
          updatedAt: new Date().toISOString(),
          jobPostingId: params.id as string,
          jobPosting: {} as any,
          interviews: [],
        }

        const mockResults: InterviewResult = {
          overallScore: 87,
          technicalScore: 92,
          behavioralScore: 85,
          communicationScore: 84,
          totalDuration: 18, // minutes
          questionsAnswered: 3,
          strengths: [
            "Strong technical knowledge in React and JavaScript",
            "Clear communication and articulation",
            "Good problem-solving approach",
            "Relevant industry experience",
          ],
          improvements: [
            "Could provide more specific examples",
            "Time management during responses",
            "Deeper knowledge of advanced concepts",
          ],
          responses: [
            {
              questionId: "q1",
              question: "Tell me about yourself and your experience with React.",
              answer:
                "I have been working with React for the past 6 years, starting from class components to modern hooks. I've built several large-scale applications...",
              score: 85,
              feedback:
                "Good overview of experience, mentioned relevant technologies and progression. Could have been more specific about achievements.",
              duration: 95,
              keywords: ["react", "experience", "hooks", "applications"],
            },
            {
              questionId: "q2",
              question: "What is the difference between let, const, and var in JavaScript?",
              answer:
                "The main differences are in scope and hoisting behavior. var is function-scoped while let and const are block-scoped...",
              score: 92,
              feedback:
                "Excellent technical answer with clear explanations of scope, hoisting, and practical examples.",
              duration: 120,
              keywords: ["scope", "hoisting", "block-scoped", "function-scoped"],
            },
            {
              questionId: "q3",
              question: "Describe a challenging project you worked on and how you overcame the difficulties.",
              answer:
                "I worked on a real-time dashboard that had performance issues with large datasets. I implemented virtualization and optimized re-renders...",
              score: 88,
              feedback:
                "Great example with specific technical solutions. Showed problem-solving skills and technical depth.",
              duration: 180,
              keywords: ["performance", "optimization", "real-time", "problem-solving"],
            },
          ],
          recommendation: "HIRE",
          confidenceLevel: 89,
        }

        setCandidate(mockCandidate)
        setResults(mockResults)
      } catch (error) {
        console.error("Failed to fetch results:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [params.id, params.candidateId])

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-100 dark:bg-green-900"
    if (score >= 80) return "bg-blue-100 dark:bg-blue-900"
    if (score >= 70) return "bg-yellow-100 dark:bg-yellow-900"
    return "bg-red-100 dark:bg-red-900"
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "HIRE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "MAYBE":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "REJECT":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Processing Interview Results</h3>
          <p className="text-muted-foreground">Our AI is analyzing the responses and generating insights...</p>
        </div>
      </div>
    )
  }

  if (!candidate || !results) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">Results not found</h3>
            <p className="text-muted-foreground mb-6">Unable to load interview results.</p>
            <Link href={`/dashboard/jobs/${params.id}`}>
              <Button>Back to Job</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/dashboard/jobs/${params.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Job
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Interview Results</h1>
            <p className="text-muted-foreground mt-1">AI-powered analysis and recommendations</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Candidate Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{candidate.name}</h2>
                <p className="text-muted-foreground">{candidate.email}</p>
                <p className="text-sm text-muted-foreground">
                  {candidate.currentRole} at {candidate.currentCompany}
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge className={`${getRecommendationColor(results.recommendation)} text-lg px-4 py-2`}>
                {results.recommendation === "HIRE" && <CheckCircle className="h-4 w-4 mr-2" />}
                {results.recommendation === "MAYBE" && <AlertTriangle className="h-4 w-4 mr-2" />}
                {results.recommendation}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">Confidence: {results.confidenceLevel}%</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div
              className={`w-20 h-20 rounded-full ${getScoreBg(results.overallScore)} flex items-center justify-center mx-auto mb-4`}
            >
              <span className={`text-2xl font-bold ${getScoreColor(results.overallScore)}`}>
                {results.overallScore}
              </span>
            </div>
            <h3 className="font-semibold mb-1">Overall Score</h3>
            <p className="text-sm text-muted-foreground">Combined assessment</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div
              className={`w-20 h-20 rounded-full ${getScoreBg(results.technicalScore)} flex items-center justify-center mx-auto mb-4`}
            >
              <span className={`text-2xl font-bold ${getScoreColor(results.technicalScore)}`}>
                {results.technicalScore}
              </span>
            </div>
            <h3 className="font-semibold mb-1">Technical</h3>
            <p className="text-sm text-muted-foreground">Technical knowledge</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div
              className={`w-20 h-20 rounded-full ${getScoreBg(results.behavioralScore)} flex items-center justify-center mx-auto mb-4`}
            >
              <span className={`text-2xl font-bold ${getScoreColor(results.behavioralScore)}`}>
                {results.behavioralScore}
              </span>
            </div>
            <h3 className="font-semibold mb-1">Behavioral</h3>
            <p className="text-sm text-muted-foreground">Soft skills & culture fit</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div
              className={`w-20 h-20 rounded-full ${getScoreBg(results.communicationScore)} flex items-center justify-center mx-auto mb-4`}
            >
              <span className={`text-2xl font-bold ${getScoreColor(results.communicationScore)}`}>
                {results.communicationScore}
              </span>
            </div>
            <h3 className="font-semibold mb-1">Communication</h3>
            <p className="text-sm text-muted-foreground">Clarity & articulation</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Strengths</span>
            </CardTitle>
            <CardDescription>Key areas where the candidate excelled</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {results.strengths.map((strength, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Areas for Improvement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-yellow-600" />
              <span>Areas for Improvement</span>
            </CardTitle>
            <CardDescription>Opportunities for growth and development</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {results.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{improvement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Interview Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Interview Statistics</CardTitle>
          <CardDescription>Overview of the interview session</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <p className="text-2xl font-bold">{results.questionsAnswered}</p>
              <p className="text-sm text-muted-foreground">Questions Answered</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <p className="text-2xl font-bold">{results.totalDuration}m</p>
              <p className="text-sm text-muted-foreground">Total Duration</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <p className="text-2xl font-bold">{results.overallScore}%</p>
              <p className="text-sm text-muted-foreground">Overall Score</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <p className="text-2xl font-bold">{results.confidenceLevel}%</p>
              <p className="text-sm text-muted-foreground">AI Confidence</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Responses */}
      <Card>
        <CardHeader>
          <CardTitle>Question-by-Question Analysis</CardTitle>
          <CardDescription>Detailed breakdown of each response</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="0" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              {results.responses.map((_, index) => (
                <TabsTrigger key={index} value={index.toString()}>
                  Question {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            {results.responses.map((response, index) => (
              <TabsContent key={index} value={index.toString()}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                      <div className="flex items-center space-x-4">
                        <Badge className={getScoreColor(response.score)}>Score: {response.score}%</Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          {Math.floor(response.duration / 60)}:{(response.duration % 60).toString().padStart(2, "0")}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Question:</h4>
                      <p className="text-muted-foreground bg-muted p-3 rounded-lg">{response.question}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Candidate's Answer:</h4>
                      <p className="bg-muted p-3 rounded-lg">{response.answer}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">AI Feedback:</h4>
                      <p className="text-muted-foreground bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                        {response.feedback}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Keywords Detected:</h4>
                      <div className="flex flex-wrap gap-2">
                        {response.keywords.map((keyword, keywordIndex) => (
                          <Badge key={keywordIndex} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Score Breakdown:</h4>
                      <Progress value={response.score} className="h-2" />
                      <p className="text-sm text-muted-foreground mt-1">
                        {response.score >= 90
                          ? "Excellent"
                          : response.score >= 80
                            ? "Good"
                            : response.score >= 70
                              ? "Average"
                              : "Needs Improvement"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-5 w-5 mr-2" />
              Move to Next Round
            </Button>
            <Button variant="outline" size="lg">
              Schedule Follow-up
            </Button>
            <Button variant="outline" size="lg" className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent">
              Reject Candidate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
