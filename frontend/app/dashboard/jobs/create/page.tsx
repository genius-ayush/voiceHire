"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Briefcase, Building, MapPin, DollarSign, GraduationCap } from 'lucide-react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import axios from "axios"

const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  requirements: z.string().optional(),
  location: z.string().optional(),
  salaryRange: z.string().optional(),
  experienceLevel: z.string().optional(),
  department: z.string().optional(),
  isActive: z.boolean().default(true),
})

export default function CreateJobPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isActive, setIsActive] = useState(true)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      requirements: formData.get("requirements") as string || undefined,
      location: formData.get("location") as string || undefined,
      salaryRange: formData.get("salaryRange") as string || undefined,
      experienceLevel: formData.get("experienceLevel") as string || undefined,
      department: formData.get("department") as string || undefined,
      isActive: isActive,
    }

    try {
      const result = jobSchema.parse(data)
      console.log(result) ; 
      // API call
      const token = localStorage.getItem("token") ; 

      if(!token){
        throw new Error("Authenticate token not found") ; 
      }

      const response = await axios.post("http://localhost:5000/jobPostings/jobs" , result , {headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },})

      console.log("job created" ,response.data) ; 

      router.push("/dashboard/jobs") ; 

    

      // Redirect to the new job's detail page
    //   router.push(`/dashboard/jobs/${newJob.id}`)
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
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/jobs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create New Job</h1>
          <p className="text-muted-foreground mt-1">Post a new job opening and start receiving applications</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <CardTitle>Basic Information</CardTitle>
            </div>
            <CardDescription>Essential details about the job position</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="e.g. Senior Frontend Developer" 
                  required 
                  className="bg-background"
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    id="department" 
                    name="department" 
                    placeholder="e.g. Engineering, Marketing, Sales" 
                    className="pl-10 bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the role, responsibilities, key objectives, and what makes this position exciting..."
                rows={6}
                required
                className="bg-background"
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              <p className="text-xs text-muted-foreground">Minimum 50 characters required</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements & Qualifications</Label>
              <Textarea
                id="requirements"
                name="requirements"
                placeholder="List the required skills, qualifications, experience, and any preferred qualifications..."
                rows={4}
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">Optional - You can add this later</p>
            </div>
          </CardContent>
        </Card>

        {/* Job Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle>Job Details</CardTitle>
            </div>
            <CardDescription>Location, compensation, and experience requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    id="location" 
                    name="location" 
                    placeholder="e.g. Remote, San Francisco, CA, Hybrid" 
                    className="pl-10 bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryRange">Salary Range</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    id="salaryRange" 
                    name="salaryRange" 
                    placeholder="e.g. $80,000 - $120,000, Competitive" 
                    className="pl-10 bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Select name="experienceLevel">
                <SelectTrigger className="bg-background">
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Select experience level (optional)" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entry Level">Entry Level (0-1 years)</SelectItem>
                  <SelectItem value="Junior">Junior (1-3 years)</SelectItem>
                  <SelectItem value="Mid-Level">Mid-Level (3-5 years)</SelectItem>
                  <SelectItem value="Senior">Senior (5-8 years)</SelectItem>
                  <SelectItem value="Lead">Lead (8+ years)</SelectItem>
                  <SelectItem value="Executive">Executive Level</SelectItem>
                </SelectContent>
              </Select>
              {errors.experienceLevel && <p className="text-sm text-destructive">{errors.experienceLevel}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Job Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Job Settings</CardTitle>
            <CardDescription>Configure how this job posting will be displayed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-base">Active Job Posting</Label>
                <p className="text-sm text-muted-foreground">
                  When active, candidates can apply and the job will be visible in your jobs list
                </p>
              </div>
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
              <Link href="/dashboard/jobs">
                <Button variant="outline" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2"></div>
                    Creating Job...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Job
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Help Text */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">💡 Tips for creating effective job postings:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Use clear, specific job titles that candidates would search for</li>
            <li>• Include key responsibilities and growth opportunities in the description</li>
            <li>• Be transparent about requirements - distinguish between "must-have" and "nice-to-have"</li>
            <li>• Mention your company culture and what makes working there special</li>
            <li>• After creating the job, you can add interview questions and start inviting candidates</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
