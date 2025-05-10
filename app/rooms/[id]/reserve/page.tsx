"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Check, Coffee, CreditCard, Printer, Users, Wifi } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { addReservation } from "@/lib/actions/reservation-actions"
import { getCurrentUser } from "@/lib/actions/auth-actions"
import type { RoomWithId } from "@/lib/models/room"

export default function ReservePage({ params }: { params: { id: string } }) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [step, setStep] = useState(1)
  const [room, setRoom] = useState<RoomWithId | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  const roomId = params.id

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser()

      if (!currentUser) {
        router.push("/login")
        return
      }

      setUser(currentUser)
      fetchRoom()
    }

    checkAuth()
  }, [roomId, router])

  const fetchRoom = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/rooms/${roomId}`)
      const data = await response.json()

      if (response.ok) {
        setRoom(data.room)
      } else {
        setError(data.error || "Failed to fetch room details")
      }
    } catch (err) {
      setError("An error occurred while fetching room details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextStep = () => {
    setStep(step + 1)
  }

  const handlePreviousStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!date) {
      setError("Please select a date")
      return
    }

    try {
      const formData = new FormData()
      formData.append("roomId", roomId)
      formData.append("date", date.toISOString().split("T")[0])
      formData.append("startTime", startTime)
      formData.append("endTime", endTime)

      const result = await addReservation(formData)

      if (result.error) {
        setError(result.error)
      } else {
        // Redirect to confirmation page
        router.push(`/rooms/${roomId}/reserve/confirmation`)
      }
    } catch (err) {
      setError("An error occurred while creating the reservation")
    }
  }

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!room || !startTime || !endTime) return 0

    const start = Number.parseInt(startTime.split(":")[0])
    const end = Number.parseInt(endTime.split(":")[0])
    const hours = end - start

    return hours * room.pricePerHour
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading room details...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="bg-error/10 text-error p-6 rounded-md">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error || "Room not found"}</p>
            <Button onClick={() => router.push("/rooms")} className="mt-4">
              Back to Rooms
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Reserve a Space</h1>
            <p className="text-neutral-grey mt-2">Complete the form below to book {room.name}.</p>
          </div>

          {/* Reservation Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center max-w-3xl mx-auto">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2",
                  step >= 1 ? "bg-primary border-primary text-white" : "border-neutral-grey text-neutral-grey",
                )}
              >
                1
              </div>
              <div className={cn("flex-1 h-1 mx-2", step >= 2 ? "bg-primary" : "bg-neutral-grey/30")} />
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2",
                  step >= 2 ? "bg-primary border-primary text-white" : "border-neutral-grey text-neutral-grey",
                )}
              >
                2
              </div>
              <div className={cn("flex-1 h-1 mx-2", step >= 3 ? "bg-primary" : "bg-neutral-grey/30")} />
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2",
                  step >= 3 ? "bg-primary border-primary text-white" : "border-neutral-grey text-neutral-grey",
                )}
              >
                3
              </div>
            </div>
            <div className="flex justify-center max-w-3xl mx-auto mt-2 text-sm">
              <div className="w-1/3 text-center">
                <p className={step >= 1 ? "text-primary font-medium" : "text-neutral-grey"}>Select Date & Time</p>
              </div>
              <div className="w-1/3 text-center">
                <p className={step >= 2 ? "text-primary font-medium" : "text-neutral-grey"}>Review Details</p>
              </div>
              <div className="w-1/3 text-center">
                <p className={step >= 3 ? "text-primary font-medium" : "text-neutral-grey"}>Payment</p>
              </div>
            </div>
          </div>

          {error && <div className="bg-error/10 text-error p-3 rounded-md mb-4">{error}</div>}

          <div className="grid md:grid-cols-3 gap-8">
            {/* Reservation Form */}
            <div className="md:col-span-2">
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Select Date & Time</CardTitle>
                    <CardDescription>Choose when you'd like to use the space</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Select a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Select value={startTime} onValueChange={setStartTime}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select start time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="09:00">9:00 AM</SelectItem>
                            <SelectItem value="10:00">10:00 AM</SelectItem>
                            <SelectItem value="11:00">11:00 AM</SelectItem>
                            <SelectItem value="12:00">12:00 PM</SelectItem>
                            <SelectItem value="13:00">1:00 PM</SelectItem>
                            <SelectItem value="14:00">2:00 PM</SelectItem>
                            <SelectItem value="15:00">3:00 PM</SelectItem>
                            <SelectItem value="16:00">4:00 PM</SelectItem>
                            <SelectItem value="17:00">5:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>End Time</Label>
                        <Select value={endTime} onValueChange={setEndTime}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select end time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10:00">10:00 AM</SelectItem>
                            <SelectItem value="11:00">11:00 AM</SelectItem>
                            <SelectItem value="12:00">12:00 PM</SelectItem>
                            <SelectItem value="13:00">1:00 PM</SelectItem>
                            <SelectItem value="14:00">2:00 PM</SelectItem>
                            <SelectItem value="15:00">3:00 PM</SelectItem>
                            <SelectItem value="16:00">4:00 PM</SelectItem>
                            <SelectItem value="17:00">5:00 PM</SelectItem>
                            <SelectItem value="18:00">6:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button onClick={handleNextStep}>Continue</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review Details</CardTitle>
                    <CardDescription>Confirm your reservation details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium mb-2">Reservation Details</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex">
                            <p className="w-24 text-neutral-grey">Space:</p>
                            <p className="font-medium">{room.name}</p>
                          </div>
                          <div className="flex">
                            <p className="w-24 text-neutral-grey">Date:</p>
                            <p className="font-medium">{date ? format(date, "PPP") : "Not selected"}</p>
                          </div>
                          <div className="flex">
                            <p className="w-24 text-neutral-grey">Time:</p>
                            <p className="font-medium">
                              {startTime.replace(":", ":")} - {endTime.replace(":", ":")}
                            </p>
                          </div>
                          <div className="flex">
                            <p className="w-24 text-neutral-grey">Duration:</p>
                            <p className="font-medium">
                              {Number.parseInt(endTime.split(":")[0]) - Number.parseInt(startTime.split(":")[0])} hours
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Price Summary</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <p className="text-neutral-grey">
                              {room.name} ({room.pricePerHour} ×{" "}
                              {Number.parseInt(endTime.split(":")[0]) - Number.parseInt(startTime.split(":")[0])} hours)
                            </p>
                            <p className="font-medium">${calculateTotalPrice()}</p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-neutral-grey">Service fee</p>
                            <p className="font-medium">$5</p>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between font-medium">
                            <p>Total</p>
                            <p>${calculateTotalPrice() + 5}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <Button variant="outline" onClick={handlePreviousStep}>
                        Back
                      </Button>
                      <Button onClick={handleNextStep}>Proceed to Payment</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment</CardTitle>
                    <CardDescription>Complete your reservation with payment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Card Number</Label>
                        <div className="flex">
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Expiration Date</Label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>CVC</Label>
                          <input
                            type="text"
                            placeholder="123"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Name on Card</Label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div className="bg-neutral-silver/30 p-4 rounded-md text-sm">
                      <p className="font-medium flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Payment Summary
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between">
                          <p className="text-neutral-grey">Subtotal</p>
                          <p>${calculateTotalPrice()}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-neutral-grey">Service fee</p>
                          <p>$5</p>
                        </div>
                        <div className="flex justify-between font-medium pt-1">
                          <p>Total</p>
                          <p>${calculateTotalPrice() + 5}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <Button variant="outline" onClick={handlePreviousStep}>
                        Back
                      </Button>
                      <Button onClick={handleSubmit}>Complete Reservation</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Room Details Sidebar */}
            <div className="md:col-span-1">
              <Card>
                <div className="relative h-48">
                  <Image
                    src={room.images[0] || "/placeholder.svg?height=200&width=300"}
                    alt={room.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <CardContent className="p-6">
                  <h2 className="font-semibold text-xl mb-1">{room.name}</h2>
                  <div className="flex items-center text-sm text-neutral-grey mb-4">
                    <span className="bg-secondary text-neutral-black px-2 py-0.5 rounded text-xs font-medium">
                      {room.type}
                    </span>
                    <span className="mx-2">•</span>
                    <Users className="h-4 w-4 mr-1" />
                    <span>{room.capacity} people</span>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-sm mb-2">Price</h3>
                      <p className="text-primary font-semibold">${room.pricePerHour} / hour</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-sm mb-2">Amenities</h3>
                      <div className="space-y-2">
                        {room.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center text-sm">
                            {amenity.includes("WiFi") && <Wifi className="h-4 w-4 mr-2 text-primary" />}
                            {amenity.includes("Coffee") && <Coffee className="h-4 w-4 mr-2 text-primary" />}
                            {amenity.includes("Printer") && <Printer className="h-4 w-4 mr-2 text-primary" />}
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-sm mb-2">Cancellation Policy</h3>
                      <p className="text-sm text-neutral-grey">
                        Free cancellation up to 24 hours before your reservation.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-4 bg-neutral-silver/30 p-4 rounded-lg">
                <h3 className="font-medium flex items-center mb-2">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  Why Book with ImpactLab
                </h3>
                <ul className="text-sm space-y-2 text-neutral-grey">
                  <li className="flex items-start">
                    <Check className="h-3 w-3 mr-2 mt-1 text-primary" />
                    <span>Instant confirmation</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-3 w-3 mr-2 mt-1 text-primary" />
                    <span>No hidden fees</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-3 w-3 mr-2 mt-1 text-primary" />
                    <span>24/7 customer support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
