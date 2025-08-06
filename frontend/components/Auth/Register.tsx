'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Brain, Eye, EyeOff } from 'lucide-react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import Link from 'next/link'
import {email, z , ZodError , ZodIssue} from "zod" ; 
import axios from 'axios'
import { useRouter } from 'next/navigation'

const registerSchema = z.object({
  name : z.string().min(2,"Name must be at least 2 characters") ,
  email : z.string().email("Invalid email address") ,
  password : z.string().min(6 , "Password must be at least 6 characters"),
})

function Register() {
  const [showPassword , setShowPassword] = useState(false) ;
  const [errors, setErrors] = useState("");  
  const [isLoading , setIsLoading] = useState(false) ; 
  const router = useRouter(); 


  const handleSubmit = async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    setIsLoading(true) ; 

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name") as string , 
      email : formData.get("email") as string , 
      password : formData.get("password") as string ,
    }

    try{
      registerSchema.parse(data) ; 
      const response = await axios.post("http://localhost:5000/auth/register" , {
        name: data.name , 
        email : data.email , 
        password : data.password 
      })
      
      const token = response.data.token ; 
      const userId = response.data.id ; 

      localStorage.setItem('recruiterId' , userId) ; 
      localStorage.setItem('token',  token)
      router.push("/dashboard");
    }catch(error){
      console.log(error) ; 
      
      setErrors("Registration failed. Please try again.")
    } finally{
      setIsLoading(false) ; 
    }
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
              {/* {errors && <p className="text-sm text-red-400">{errors}</p>} */}
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
              {/* {errors && <p className="text-sm text-red-400">{errors}</p>} */}
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
                  placeholder="Create a password"
                  className=""
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
              {/* {errors && <p className="text-sm text-red-400">{errors}</p>} */}
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

          {errors && <p className="text-center text-red-500 mt-4">{errors}</p>}
        </CardContent>
      </Card>
    </div>
  )
}

export default Register