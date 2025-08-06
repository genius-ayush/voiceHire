'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Brain, Eye, EyeOff } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Label } from '../ui/label'
import {email, z} from "zod" ; 
import { useRouter } from 'next/navigation'
import axios from 'axios'

const loginSchema = z.object({
  email : z.string().email("Invalid email address") , 
  password : z.string().min(6 , "Password must be of at least 6 characters")
})


function Login() {
  const[isLoading , setIsLoading] = useState(false) ; 
  const[showPassword , setShowPassword] = useState(false) ; 
  const[errors , setErrors] = useState(""); 
  const router = useRouter() ; 


  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault() ;
    setIsLoading(true) ; 

    const formData = new FormData(e.currentTarget);

    const data = {
      email :formData.get("email") as string , 
      password : formData.get("password") as string ,
    }

    try{
      loginSchema.parse(data); 
      
      const response = await axios.post("http://localhost:5000/auth/login" , {
        email : data.email , 
        password : data.password
      })

      const token = response.data.token ; 
      const userId = response.data.id ; 

      localStorage.setItem('recruiterId' , userId) ; 
      localStorage.setItem('token',  token)
      router.push("/dashboard");
      
    }catch(err){
      console.log(err) ;
      setErrors("Login failed. Please try again.")
    }finally{
      setIsLoading(false); 
    }
  }
  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <Card className="w-full max-w-md ">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-8 w-8 " />
            <span className="text-2xl font-bold text-white">VoiceHireAI</span>
          </div>
          <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
          <CardDescription className="text-gray-300">Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className=" pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full " disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-gray-50 font-bold hover:text-gray-300">
                Sign up
              </Link>
            </p>
          </div>
          {errors && <p className="text-center text-red-500 mt-4">{errors}</p>}
        </CardContent>
      </Card>
    </div>
  )
}

export default Login