"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, ChevronDown, Edit, MoreHorizontal, Plus, Search, Trash } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { addRoom, removeRoom } from "@/lib/actions/room-actions"
import { getCurrentUser } from "@/lib/actions/auth-actions"
import type { RoomWithId } from "@/lib/models/room"

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomWithId[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null)
  const [isAddRoomDialogOpen, setIsAddRoomDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser()

      if (!user || user.role !== "admin") {
        router.push("/login")
        return
      }

      fetchRooms()
    }

    checkAuth()
  }, [router])

  const fetchRooms = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/rooms")
      const data = await response.json()

      if (response.ok) {
        setRooms(data.rooms)
      } else {
        setError(data.error || "Failed to fetch rooms")
      }
    } catch (err) {
      setError("An error occurred while fetching rooms")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteRoom = (roomId: string) => {
    setRoomToDelete(roomId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteRoom = async () => {
    if (roomToDelete) {
      try {
        const result = await removeRoom(roomToDelete)

        if (result.error) {
          setError(result.error)
        } else {
          // Remove room from local state
          setRooms(rooms.filter((room) => room.id !== roomToDelete))
        }
      } catch (err) {
        setError("An error occurred while deleting the room")
      }

      setIsDeleteDialogOpen(false)
      setRoomToDelete(null)
    }
  }

  const handleAddRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const formData = new FormData(e.currentTarget)
      const result = await addRoom(formData)

      if (result.error) {
        setError(result.error)
      } else {
        setIsAddRoomDialogOpen(false)
        fetchRooms() // Refresh the room list
      }
    } catch (err) {
      setError("An error occurred while adding the room")
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 flex justify-center items-center">
            <p>Loading rooms...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
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
              <h1 className="text-2xl font-bold">Room Management</h1>
              <p className="text-neutral-grey">Manage coworking spaces and rooms</p>
            </div>
          </div>

          {error && <div className="bg-error/10 text-error p-3 rounded-md mb-4">{error}</div>}

          {/* Actions Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-grey" />
              <Input
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full md:w-80"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Dialog open={isAddRoomDialogOpen} onOpenChange={setIsAddRoomDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full md:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Room
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Room</DialogTitle>
                    <DialogDescription>Create a new room or space that can be booked by clients.</DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleAddRoom} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Room Name</Label>
                      <Input id="name" name="name" placeholder="Executive Office" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="A private office for executives and small teams."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Room Type</Label>
                        <Select name="type" defaultValue="Private Office">
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Private Office">Private Office</SelectItem>
                            <SelectItem value="Meeting Room">Meeting Room</SelectItem>
                            <SelectItem value="Event Space">Event Space</SelectItem>
                            <SelectItem value="Hot Desk">Hot Desk</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input id="capacity" name="capacity" placeholder="1-3" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pricePerHour">Price Per Hour ($)</Label>
                      <Input
                        id="pricePerHour"
                        name="pricePerHour"
                        type="number"
                        min="1"
                        step="0.01"
                        placeholder="35"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amenities">Amenities (comma separated)</Label>
                      <Input id="amenities" name="amenities" placeholder="WiFi, Coffee, Printer" />
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddRoomDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add Room</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

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
                  <DropdownMenuItem onClick={() => setSearchTerm("")}>All Rooms</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchTerm("Private Office")}>Private Offices</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchTerm("Meeting Room")}>Meeting Rooms</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchTerm("Event Space")}>Event Spaces</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchTerm("Hot Desk")}>Hot Desks</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Rooms Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Price/Hour</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.length > 0 ? (
                  filteredRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.name}</TableCell>
                      <TableCell>{room.type}</TableCell>
                      <TableCell>{room.capacity}</TableCell>
                      <TableCell>${room.pricePerHour}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            room.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {room.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
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
                              Edit Room
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-error" onClick={() => handleDeleteRoom(room.id)}>
                              <Trash className="h-4 w-4 mr-2" />
                              Delete Room
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-neutral-grey">
                      No rooms found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-neutral-grey">
              Showing <span className="font-medium">{filteredRooms.length}</span> of{" "}
              <span className="font-medium">{rooms.length}</span> rooms
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Room</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this room? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteRoom}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
