import { ArrowRight, CheckCircle, Star } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'

function Hero() {
  return (
    <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-sm">
                <Star className="h-4 w-4 mr-2 text-primary" />
                Trusted by many companies
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Automate Your Candidate Interviews with <span className="text-primary">AI</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Create job posts, assign interview questions, and get intelligent candidate rankings. Streamline your
                hiring process with AI-powered insights.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="px-8 py-3">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="px-8 py-3 bg-transparent">
                  Login to Dashboard
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Setup in minutes</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-2xl border border-border bg-card p-8 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                  <div className="h-20 bg-muted rounded"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 bg-primary rounded w-20"></div>
                    <div className="h-8 bg-muted rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-3xl transform scale-105"></div>
          </div>
        </div>
      </section>
  )
}

export default Hero