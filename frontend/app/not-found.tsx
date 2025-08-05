import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <Card className="w-full max-w-md  text-center">
        <CardContent className="p-12">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Brain className="h-12 w-12 " />
            <span className="text-3xl font-bold">VoiceHireAI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-6xl font-bold  mb-4">404</h1>
            <h2 className="text-2xl font-semibold  mb-2">Page Not Found</h2>
            <p className="text-gray-400">The page you're looking for doesn't exist or has been moved.</p>
          </div>

          <div className="space-y-4">
            <Link href="/dashboard" className="block">
              <Button className="w-full ">
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button
                variant="outline"
                className="w-full  bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
    </div>
  )
}
