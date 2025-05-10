import { type NextRequest, NextResponse } from "next/server"
import { deleteRoom, getRoomById, updateRoom } from "@/lib/models/room"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  console.log(
    '______________________________________________________________________________'
  );
  console.log('🚀 ~ GET ~ params:', params);

  
  try {
    const roomId = params.id
    const room = await getRoomById(roomId)

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json({ room })
  } catch (error) {
    console.error("Error fetching room:", error)
    return NextResponse.json({ error: "An error occurred while fetching the room" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const roomId = params.id
    const roomData = await request.json()

    const updatedRoom = await updateRoom(roomId, roomData)

    if (!updatedRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json({ room: updatedRoom })
  } catch (error) {
    console.error("Error updating room:", error)
    return NextResponse.json({ error: "An error occurred while updating the room" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const roomId = params.id
    const success = await deleteRoom(roomId)

    if (!success) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting room:", error)
    return NextResponse.json({ error: "An error occurred while deleting the room" }, { status: 500 })
  }
}
