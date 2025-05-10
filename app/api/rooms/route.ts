import { type NextRequest, NextResponse } from "next/server"
import { createRoom, getAllRooms } from "@/lib/models/room"

export async function GET() {
  try {
    const rooms = await getAllRooms()
    return NextResponse.json({ rooms })
  } catch (error) {
    console.error("Error fetching rooms:", error)
    return NextResponse.json({ error: "An error occurred while fetching rooms" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const roomData = await request.json()

    if (!roomData.name || !roomData.type || !roomData.capacity || !roomData.pricePerHour) {
      return NextResponse.json({ error: "Name, type, capacity, and price per hour are required" }, { status: 400 })
    }

    // Set default status to active if not specified
    if (!roomData.status) {
      roomData.status = "active"
    }

    // Set default amenities to empty array if not specified
    if (!roomData.amenities) {
      roomData.amenities = []
    }

    // Set default images to empty array if not specified
    if (!roomData.images) {
      roomData.images = []
    }

    const newRoom = await createRoom(roomData)

    return NextResponse.json({ room: newRoom }, { status: 201 })
  } catch (error) {
    console.error("Error creating room:", error)
    return NextResponse.json({ error: "An error occurred while creating the room" }, { status: 500 })
  }
}
