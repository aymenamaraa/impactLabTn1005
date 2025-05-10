"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, Calendar, ChevronDown, Edit, MoreHorizontal, Plus, Search, Trash, X } from "lucide-react"
import Link from "next/link"

// Mock reservation data
const mockReservations = [
  {
    id: "1",
    roomName: "Executive Office",
    roomId: "1",
    userName: "John Doe",
    userId: "1",
    date: "2023-05-15",
    startTime: "09:00",
    endTime: "11:00",
    status: "confirmed",
    totalPrice: 70,
  },
  {
    id: "2",
    roomName: "Conference Room",
    roomId: "2",
    userName: "Jane Smith",
    userId: "2",
    date: "2023-05-16",
    startTime: "13:00",
    endTime: "15:00",
    status: "confirmed",
    totalPrice: 150,
  },
  {
    id: "3",
    roomName: "Workshop Area",
    roomId: "3",
    userName: "Robert Johnson",
    userId: "3",
    date: "2023-05-17",
    startTime: "10:00",
    endTime: "16:00",
    status: "pending",
    totalPrice: 900,
  },
  {
    id: "4",
    roomName: "Meeting Pod",
    roomId: "6",
    userName: "Emily Davis",
    userId: "4",
    date: "2023-05-18",
    startTime: "14:00",
    endTime: "16:00",
    status: "cancelled",
    totalPrice: 80,
  },
  {
    id: "5",
    roomName: "Team Office",
    roomId: "5",
    userName: "Michael Wilson",
    userId: "5",
    date: "2023-05-19",
    startTime: "09:00",
    endTime: "17:00",
    status: "confirmed",
    totalPrice: 480,
  },
  {
    id: "6",
    roomName: "Flex Desk",
    roomId: "4",
    userName: "Sarah Brown",
    userId: "6",
    date: "2023-05-20",
    startTime: "10:00",
    endTime: "12:00",
    status: "confirmed",
    totalPrice: 30,
  },
]

export default function ReservationsPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const [reservations, setReservations] = useState(mockReservations)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [reservationToCancel, setReservationToCancel] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  // If not authenticated or not admin, don't render the page
  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.roomName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCancelReservation = (reservationId: string) => {
    setReservationToCancel(reservationId)
    setIsCancelDialogOpen(true)
  }

  const confirmCancelReservation = () => {
    if (reservationToCancel) {
      setReservations(
        reservations.map((reservation) =>
          reservation.id === reservationToCancel ? { ...reservation, status: "cancelled" } : reservation,
        ),
      )
      setIsCancelDialogOpen(false)
      setReservationToCancel(null)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <Link href="/admin" className="mr-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Reservation Management</h1>
              <p className="text-neutral-grey">Manage room bookings and reservations</p>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-grey" />
              <Input
                placeholder="Search reservations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full md:w-80"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button className="w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                New Reservation
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <span>Filter</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>All Reservations</DropdownMenuItem>
                  <DropdownMenuItem>Confirmed</DropdownMenuItem>
                  <DropdownMenuItem>Pending</DropdownMenuItem>
                  <DropdownMenuItem>Cancelled</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Today</DropdownMenuItem>
                  <DropdownMenuItem>This Week</DropdownMenuItem>
                  <DropdownMenuItem>This Month</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Reservations Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.length > 0 ? (
                  filteredReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">{reservation.roomName}</TableCell>
                      <TableCell>{reservation.userName}</TableCell>
                      <TableCell>{new Date(reservation.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {reservation.startTime.replace(":", ":")} - {reservation.endTime.replace(":", ":")}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            reservation.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : reservation.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>${reservation.totalPrice}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Reservation
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {reservation.status !== "cancelled" && (
                              <DropdownMenuItem
                                className="text-error"
                                onClick={() => handleCancelReservation(reservation.id)}
                              >
                                <X className="h-4 w-4 mr-2" />
                                Cancel Reservation
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-error">
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-neutral-grey">
                      No reservations found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-neutral-grey">
              Showing <span className="font-medium">{filteredReservations.length}</span> of{" "}
              <span className="font-medium">{reservations.length}</span> reservations
            </p>

            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-white">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Reservation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this reservation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              No, Keep It
            </Button>
            <Button variant="destructive" onClick={confirmCancelReservation}>
              Yes, Cancel It
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
