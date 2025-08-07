"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, MessageSquare, TrendingUp, Plus, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"


interface DashboardStats {
  totalJobs: number
  totalQuestions: number
  totalCandidates: number
  activeInterviews: number
  completedInterviews: number
  avgScore: number
}

interface RecentActivity {
  id: string
  type: "job_created" | "candidate_applied" | "interview_completed"
  title: string
  description: string
  timestamp: string
  score?: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    totalQuestions: 0,
    totalCandidates: 0,
    activeInterviews: 0,
    completedInterviews: 0,
    avgScore: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter(); 

  useEffect(() => {
    const fetchDashboardData = async () => {

      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/auth/login")
        return
      }

      try{
        const res = await axios.get("http://localhost:5000/recruiters/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },

        })
      if(res.data?.stats){
        setStats(res.data.stats)
      }
      }catch(err){
        console.error("Error fetching user:" , err) ; 
      }

      

      // setStats({
      //   totalJobs: 8,
      //   totalQuestions: 32,
      //   totalCandidates: 47,
      //   activeInterviews: 3,
      //   completedInterviews: 12,
      //   avgScore: 84,
      // })

      // setRecentActivity([
      //   {
      //     id: "1",
      //     type: "interview_completed",
      //     title: "Sarah Johnson - Senior Frontend Developer",
      //     description: "Interview completed with score of 87%",
      //     timestamp: "2 hours ago",
      //     score: 87,
      //   },
      //   {
      //     id: "2",
      //     type: "candidate_applied",
      //     title: "New candidate applied",
      //     description: "Michael Chen applied for Product Manager position",
      //     timestamp: "4 hours ago",
      //   },
      //   {
      //     id: "3",
      //     type: "job_created",
      //     title: "New job posted",
      //     description: "UX Designer position created",
      //     timestamp: "1 day ago",
      //   },
      //   {
      //     id: "4",
      //     type: "interview_completed",
      //     title: "Emily Rodriguez - UX Designer",
      //     description: "Interview completed with score of 92%",
      //     timestamp: "2 days ago",
      //     score: 92,
      //   },
      // ])
      console.log(stats) ; 
      setIsLoading(false)
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    {
      title: "Active Jobs",
      value: stats.totalJobs,
      description: "Job postings",
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    {
      title: "Total Candidates",
      value: stats.totalCandidates,
      description: "Applications received",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "Interview Questions",
      value: stats.totalQuestions,
      description: "Questions created",
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "job_created":
        return <Briefcase className="h-4 w-4" />
      case "candidate_applied":
        return <Users className="h-4 w-4" />
      case "interview_completed":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "job_created":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900"
      case "candidate_applied":
        return "text-green-600 bg-green-100 dark:bg-green-900"
      case "interview_completed":
        return "text-purple-600 bg-purple-100 dark:bg-purple-900"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900"
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your hiring activities</p>
        </div>
        <Link href="/dashboard/jobs/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Job
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your hiring pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{activity.title}</p>
                      <div className="flex items-center space-x-2">
                        {activity.score && (
                          <Badge variant="secondary" className="text-xs">
                            {activity.score}%
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.timestamp}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full bg-transparent">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard/jobs/create">
              <Button className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Create New Job
              </Button>
            </Link>
            <Link href="/dashboard/jobs">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Briefcase className="h-4 w-4 mr-2" />
                Manage Jobs
              </Button>
            </Link>
            <Link href="/dashboard/candidates">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Users className="h-4 w-4 mr-2" />
                View Candidates
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Interview Pipeline */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Interview Pipeline</CardTitle>
          <CardDescription>Current status of ongoing interviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-border rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.activeInterviews}</div>
              <p className="text-sm text-muted-foreground">Active Interviews</p>
              <p className="text-xs text-muted-foreground mt-1">In progress</p>
            </div>
            <div className="text-center p-6 border border-border rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.completedInterviews}</div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </div>
            <div className="text-center p-6 border border-border rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.avgScore}%</div>
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className="text-xs text-muted-foreground mt-1">All interviews</p>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}
