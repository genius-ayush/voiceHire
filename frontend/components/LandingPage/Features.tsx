import React from 'react'
import {  Brain, Users, Zap } from 'lucide-react'
import { Card, CardContent } from '../ui/card'

function Features() {
  return (
    <section className="border-t border-border bg-muted/50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Why Choose VoiceHireAI?</h2>
            <p className="text-xl text-muted-foreground">Powerful features to revolutionize your hiring process</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">AI-Powered Analysis</h3>
                <p className="text-muted-foreground">
                  Advanced AI algorithms analyze candidate responses and provide intelligent rankings
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Streamlined Process</h3>
                <p className="text-muted-foreground">
                  Create jobs, add questions, and manage interviews all in one intuitive platform
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Reduce time-to-hire by 70% with automated screening and intelligent matching
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
  )
}

export default Features