"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Trophy, Star, Clock, MessageSquare, Download, Eye } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Candidate {
  id: string
  name: string
  email: string
  avatar?: string
  overallScore: number
  technicalScore: number
  behavioralScore: number
  communicationScore: number
  interviewDate: string
  duration: number
  questionsAnswered: number
  totalQuestions: number
  status: "completed" | "in-progress" | "scheduled"
  rank: number
}

export default function JobResultsPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [jobTitle, setJobTitle] = useState("")
  const params = useParams()

  useEffect(() => {
    // Simulate API call for candidates results
    const fetchResults = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockCandidates: Candidate[] = [
        {
          id: "1",
          name: "Sarah Johnson",
          email: "sarah.johnson@email.com",
          overallScore: 92,
          technicalScore: 95,
          behavioralScore: 88,
          communicationScore: 93,
          interviewDate: "2024-01-20T10:00:00Z",
          duration: 45,
          questionsAnswered: 8,
          totalQuestions: 8,
          status: "completed",
          rank: 1,
        },
        {
          id: "2",
          name: "Michael Chen",
          email: "michael.chen@email.com",
          overallScore: 87,
          technicalScore: 90,
          behavioralScore: 85,
          communicationScore: 86,
          interviewDate: "2024-01-19T14:30:00Z",
          duration: 42,
          questionsAnswered: 8,
          totalQuestions: 8,
          status: "completed",
          rank: 2,
        },
        {
          id: "3",
          name: "Emily Rodriguez",
          email: "emily.rodriguez@email.com",
          overallScore: 84,
          technicalScore: 82,
          behavioralScore: 87,
          communicationScore: 83,
          interviewDate: "2024-01-18T11:15:00Z",
          duration: 38,
          questionsAnswered: 7,
          totalQuestions: 8,
          status: "completed",
          rank: 3,
        },
        {
          id: "4",
          name: "David Kim",
          email: "david.kim@email.com",
          overallScore: 79,
          technicalScore: 85,
          behavioralScore: 75,
          communicationScore: 77,
          interviewDate: "2024-01-17T16:00:00Z",
          duration: 35,
          questionsAnswered: 6,
          totalQuestions: 8,
          status: "completed",
          rank: 4,
        },
        {
          id: "5",
          name: "Lisa Thompson",
          email: "lisa.thompson@email.com",
          overallScore: 0,
          technicalScore: 0,
          behavioralScore: 0,
          communicationScore: 0,
          interviewDate: "2024-01-22T09:00:00Z",
          duration: 0,
          questionsAnswered: 0,
          totalQuestions: 8,
          status: "scheduled",
          rank: 5,
        },
      ]

      setCandidates(mockCandidates)
      setJobTitle("Senior Frontend Developer")
      setIsLoading(false)
    }

    fetchResults()
  }, [params.id])

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 80) return "text-yellow-400"
    if (score >= 70) return "text-orange-400"
    return "text-red-400"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-green-600"
    if (score >= 80) return "bg-yellow-600"
    if (score >= 70) return "bg-orange-600"
    return "bg-red-600"
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-400" />
    if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Trophy className="h-5 w-5 text-amber-600" />
    return <span className="text-gray-400 font-semibold">#{rank}</span>
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600 text-white">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-600 text-white">In Progress</Badge>
      case "scheduled":
        return <Badge className="bg-gray-600 text-white">Scheduled</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const completedCandidates = candidates.filter((c) => c.status === "completed")
  const averageScore =
    completedCandidates.length > 0
      ? Math.round(completedCandidates.reduce((sum, c) => sum + c.overallScore, 0) / completedCandidates.length)
      : 0

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href={`/dashboard/jobs/${params.id}`}>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Job Details
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Interview Results</h1>
          <p className="text-gray-400 mt-1">{jobTitle} - Candidate Rankings</p>
        </div>
        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
          <Download className="h-4 w-4 mr-2" />
          Export Results
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Candidates</p>
                <p className="text-3xl font-bold text-white">{candidates.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Completed</p>
                <p className="text-3xl font-bold text-white">{completedCandidates.length}</p>
              </div>
              <Star className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Average Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(averageScore)}`}>{averageScore}%</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Avg Duration</p>
                <p className="text-3xl font-bold text-white">
                  {completedCandidates.length > 0
                    ? Math.round(
                        completedCandidates.reduce((sum, c) => sum + c.duration, 0) / completedCandidates.length,
                      )
                    : 0}
                  m
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Candidates List */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Candidate Rankings</CardTitle>
          <CardDescription className="text-gray-400">Ranked by overall interview performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <Card key={candidate.id} className="bg-gray-700/50 border-gray-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        {getRankIcon(candidate.rank)}
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-violet-600 text-white">
                            {candidate.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{candidate.name}</h3>
                        <p className="text-sm text-gray-400">{candidate.email}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          {getStatusBadge(candidate.status)}
                          {candidate.status === "completed" && (
                            <>
                              <span className="text-sm text-gray-400">
                                {candidate.questionsAnswered}/{candidate.totalQuestions} questions
                              </span>
                              <span className="text-sm text-gray-400">{candidate.duration}m duration</span>
                              <span className="text-sm text-gray-400">
                                {new Date(candidate.interviewDate).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      {candidate.status === "completed" && (
                        <div className="text-right space-y-2">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <p className="text-xs text-gray-400">Overall</p>
                              <p className={`text-2xl font-bold ${getScoreColor(candidate.overallScore)}`}>
                                {candidate.overallScore}%
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-400">Technical</p>
                              <p className={`text-sm font-semibold ${getScoreColor(candidate.technicalScore)}`}>
                                {candidate.technicalScore}%
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-400">Behavioral</p>
                              <p className={`text-sm font-semibold ${getScoreColor(candidate.behavioralScore)}`}>
                                {candidate.behavioralScore}%
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-400">Communication</p>
                              <p className={`text-sm font-semibold ${getScoreColor(candidate.communicationScore)}`}>
                                {candidate.communicationScore}%
                              </p>
                            </div>
                          </div>
                          <div className="w-48">
                            <Progress value={candidate.overallScore} className="h-2" />
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        {candidate.status === "completed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Report
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
