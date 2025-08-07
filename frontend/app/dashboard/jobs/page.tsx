"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, MapPin, Calendar, Eye, Edit, Trash2, MessageSquare, Search, Briefcase } from 'lucide-react'
import { Input } from "@/components/ui/input"
import Link from "next/link"
import axios from "axios"

interface Job {
  id: string
  title: string
  description: string
  location: string
  experience: string
  employmentType: string
  createdAt: string
  questionsCount: number
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
            console.error("Token not found")
            setJobs([])
            return
          }
        
        
          const response = await axios.get("http://localhost:5000/jobPostings/jobs", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          setJobs(response.data || [])
          console.log("says hi");
          console.log(response.data) ; 
      } catch (error) {
        console.error("Failed to fetch jobs:", error)
        // Set some default jobs if everything fails
        setJobs([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return
  
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("No token found")
        return
      }
  
      await axios.delete(`http://localhost:5000/jobPostings/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      // ✅ Remove job from state on successful deletion
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId))
    } catch (error) {
      console.error("Failed to delete job:", error)
      alert("Failed to delete the job. Please try again.")
    }
  }

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">My Jobs</h1>
            <p className="text-gray-400 mt-1">Manage your job postings</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className=" border-gray-700">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3 mb-4"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 bg-gray-700 rounded w-16"></div>
                    <div className="h-8 bg-gray-700 rounded w-16"></div>
                  </div>
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">My Jobs</h1>
          <p className="text-gray-400 mt-1">Manage your job postings</p>
        </div>
        <Link href="/dashboard/jobs/create">
          <Button className="">
            <Plus className="h-4 w-4 mr-2" />
            Add New Job
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
        />
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <Card className=" ">
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm ? "Try adjusting your search terms." : "Get started by creating your first job posting."}
            </p>
            {!searchTerm && (
              <Link href="/dashboard/jobs/create">
                <Button className="">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Job
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className=" transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg mb-2">{job.title}</CardTitle>
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(job.createdAt)}
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                    {job.employmentType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4 line-clamp-3">{job.description}</CardDescription>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-white-400">Experience: {job.experience}</span>
                  <div className="flex items-center text-sm text-gray-400">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {job.questionsCount} questions
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link href={`/dashboard/jobs/${job.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
                    onClick={() => handleDeleteJob(job.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
