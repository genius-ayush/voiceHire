import { Brain } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'

function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">VoiceHireAI</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>
  )
}

export default Header