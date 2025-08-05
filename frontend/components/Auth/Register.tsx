'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Brain } from 'lucide-react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import Link from 'next/link'


function Register() {
  const [showPassword , setShowPassword] = useState(false) ;
  const [errors , setErrors] = useState("") ; 
  const [isLoading , setIsLoading] = useState(false) ; 
  const handleSubmit = ()=>{

  }
  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <Card className="w-full max-w-md ">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-8 w-8 " />
            <span className="text-2xl font-bold ">VoiceHireAI</span>
          </div>
          <CardTitle className="text-2xl text-white">Create Account</CardTitle>
          <CardDescription className="text-gray-300">Join VoiceHireAI to start hiring smarter</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                className=""
                required
              />
              {/* {errors.name && <p className="text-sm text-red-400">{errors.name}</p>} */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                className=""
                required
              />
              {/* {errors.email && <p className="text-sm text-red-400">{errors.email}</p>} */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  // type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className=""
                  required
                />
                <button
                  type="button"
                  // onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {/* {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} */}
                </button>
              </div>
              {/* {errors.password && <p className="text-sm text-red-400">{errors.password}</p>} */}
            </div>

            <Button type="submit" className="w-full " disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-gray-50 font-bold hover:text-gray-300">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Register