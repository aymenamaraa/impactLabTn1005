"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Calendar, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { getCurrentUser } from "@/lib/actions/auth-actions"

export default function ConfirmationPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const roomId = params.id

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser()

      if (!user) {
        router.push("/login")
        return
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="border-green-100">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Reservation Confirmed!</CardTitle>
              <CardDescription>
                Your booking has been successfully confirmed. You'll receive a confirmation email shortly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-6 space-y-6">
                <div className="rounded-lg bg-neutral-silver/30 p-6">
                  <h3 className="font-medium text-lg mb-4">Reservation Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p className="text-neutral-grey">Your reservation date will be shown here</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">Time</p>
                        <p className="text-neutral-grey">Your reservation time will be shown here</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-neutral-grey">123 Innovation Street, Tech District, City 12345</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <p>
                    You can view and manage your reservations in your profile. If you need to make any changes, please
                    contact us at least 24 hours before your reservation.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button asChild>
                      <Link href="/profile">View My Reservations</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/">Return to Home</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
