import { type NextRequest, NextResponse } from "next/server"
import { deleteReservation, getReservationById, updateReservation } from "@/lib/models/reservation"
import { getRoomById } from "@/lib/models/room"
import { findUserById } from "@/lib/models/user"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reservationId = params.id
    const reservation = await getReservationById(reservationId)

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    // Fetch room and user details
    const room = await getRoomById(reservation.roomId)
    const user = await findUserById(reservation.userId)

    const reservationWithDetails = {
      ...reservation,
      roomName: room?.name || "Unknown Room",
      userName: user?.name || "Unknown User",
    }

    return NextResponse.json({ reservation: reservationWithDetails })
  } catch (error) {
    console.error("Error fetching reservation:", error)
    return NextResponse.json({ error: "An error occurred while fetching the reservation" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reservationId = params.id
    const reservationData = await request.json()

    const updatedReservation = await updateReservation(reservationId, reservationData)

    if (!updatedReservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    return NextResponse.json({ reservation: updatedReservation })
  } catch (error) {
    console.error("Error updating reservation:", error)
    return NextResponse.json({ error: "An error occurred while updating the reservation" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reservationId = params.id
    const success = await deleteReservation(reservationId)

    if (!success) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting reservation:", error)
    return NextResponse.json({ error: "An error occurred while deleting the reservation" }, { status: 500 })
  }
}
