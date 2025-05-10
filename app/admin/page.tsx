"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Calendar, Clock, DollarSign, Home, Users } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const router = useRouter()

  // useEffect(() => {
  //   // Redirect if not authenticated or not an admin
  //   if (!isAuthenticated || user?.role !== "admin") {
  //     router.push("/login")
  //   }
  // }, [isAuthenticated, user, router])

  // // If not authenticated or not admin, don't render the dashboard
  // if (!isAuthenticated || user?.role !== "admin") {
  //   return null
  // }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-neutral-silver/30">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-neutral-grey mt-2">
              Welcome back, {user?.name}. Here's what's happening at ImpactLab today.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-grey">Total Bookings</p>
                    <h3 className="text-2xl font-bold mt-1">128</h3>
                    <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-grey">Active Users</p>
                    <h3 className="text-2xl font-bold mt-1">64</h3>
                    <p className="text-xs text-green-600 mt-1">+8% from last month</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-grey">Room Utilization</p>
                    <h3 className="text-2xl font-bold mt-1">78%</h3>
                    <p className="text-xs text-green-600 mt-1">+5% from last month</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Home className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-grey">Revenue</p>
                    <h3 className="text-2xl font-bold mt-1">$12,450</h3>
                    <p className="text-xs text-green-600 mt-1">+15% from last month</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Content */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reservations">Reservations</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="rooms">Rooms</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recent Activity */}
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest actions and events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">New Reservation</p>
                          <p className="text-xs text-neutral-grey">John Doe booked Conference Room for tomorrow</p>
                          <p className="text-xs text-neutral-grey mt-1">10 minutes ago</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">New User Registration</p>
                          <p className="text-xs text-neutral-grey">Sarah Johnson created an account</p>
                          <p className="text-xs text-neutral-grey mt-1">45 minutes ago</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-warning/10 p-2 rounded-full mr-3">
                          <Clock className="h-4 w-4 text-warning" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Reservation Updated</p>
                          <p className="text-xs text-neutral-grey">Team Office booking extended by 2 hours</p>
                          <p className="text-xs text-neutral-grey mt-1">2 hours ago</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-error/10 p-2 rounded-full mr-3">
                          <Calendar className="h-4 w-4 text-error" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Reservation Cancelled</p>
                          <p className="text-xs text-neutral-grey">Meeting Pod reservation for today cancelled</p>
                          <p className="text-xs text-neutral-grey mt-1">3 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Analytics */}
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Booking Analytics</CardTitle>
                    <CardDescription>Room utilization over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center bg-neutral-silver/50 rounded-md">
                      <BarChart3 className="h-8 w-8 text-neutral-grey" />
                      <span className="ml-2 text-neutral-grey">Chart would be displayed here</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-neutral-silver/30 p-3 rounded-md">
                        <p className="text-xs text-neutral-grey">Most Booked</p>
                        <p className="font-medium">Conference Room</p>
                      </div>

                      <div className="bg-neutral-silver/30 p-3 rounded-md">
                        <p className="text-xs text-neutral-grey">Least Booked</p>
                        <p className="font-medium">Hot Desks</p>
                      </div>

                      <div className="bg-neutral-silver/30 p-3 rounded-md">
                        <p className="text-xs text-neutral-grey">Peak Hours</p>
                        <p className="font-medium">10 AM - 2 PM</p>
                      </div>

                      <div className="bg-neutral-silver/30 p-3 rounded-md">
                        <p className="text-xs text-neutral-grey">Avg. Duration</p>
                        <p className="font-medium">2.5 hours</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button asChild variant="outline" className="h-auto flex flex-col items-center justify-center p-4">
                      <Link href="/admin/reservations">
                        <Calendar className="h-6 w-6 mb-2" />
                        <span>Manage Reservations</span>
                      </Link>
                    </Button>

                    <Button asChild variant="outline" className="h-auto flex flex-col items-center justify-center p-4">
                      <Link href="/admin/users">
                        <Users className="h-6 w-6 mb-2" />
                        <span>Manage Users</span>
                      </Link>
                    </Button>

                    <Button asChild variant="outline" className="h-auto flex flex-col items-center justify-center p-4">
                      <Link href="/admin/rooms">
                        <Home className="h-6 w-6 mb-2" />
                        <span>Manage Rooms</span>
                      </Link>
                    </Button>

                    <Button asChild variant="outline" className="h-auto flex flex-col items-center justify-center p-4">
                      <Link href="/admin/reports">
                        <BarChart3 className="h-6 w-6 mb-2" />
                        <span>View Reports</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reservations">
              <Card>
                <CardHeader>
                  <CardTitle>Reservations Management</CardTitle>
                  <CardDescription>View and manage all reservations</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-grey">Reservation management interface would be displayed here.</p>
                  <Button asChild className="mt-4">
                    <Link href="/admin/reservations">Go to Reservations</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>View and manage all users</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-grey">User management interface would be displayed here.</p>
                  <Button asChild className="mt-4">
                    <Link href="/admin/users">Go to Users</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rooms">
              <Card>
                <CardHeader>
                  <CardTitle>Room Management</CardTitle>
                  <CardDescription>View and manage all rooms</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-grey">Room management interface would be displayed here.</p>
                  <Button asChild className="mt-4">
                    <Link href="/admin/rooms">Go to Rooms</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
