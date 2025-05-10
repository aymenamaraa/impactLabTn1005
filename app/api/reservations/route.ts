import { type NextRequest, NextResponse } from "next/server"
import { createReservation, getAllReservations } from "@/lib/models/reservation"
import { getRoomById } from "@/lib/models/room"
import { findUserById } from "@/lib/models/user"

export async function GET() {
  try {
    const reservations = await getAllReservations()

    // Fetch room and user details for each reservation
    const reservationsWithDetails = await Promise.all(
      reservations.map(async (reservation) => {
        const room = await getRoomById(reservation.roomId)
        const user = await findUserById(reservation.userId)

        return {
          ...reservation,
          roomName: room?.name || "Unknown Room",
          userName: user?.name || "Unknown User",
        }
      }),
    )

    return NextResponse.json({ reservations: reservationsWithDetails })
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return NextResponse.json({ error: "An error occurred while fetching reservations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const reservationData = await request.json()

    if (
      !reservationData.roomId ||
      !reservationData.userId ||
      !reservationData.date ||
      !reservationData.startTime ||
      !reservationData.endTime
    ) {
      return NextResponse.json(
        { error: "Room ID, user ID, date, start time, and end time are required" },
        { status: 400 },
      )
    }

    // Set default status to pending if not specified
    if (!reservationData.status) {
      reservationData.status = "pending"
    }

    // Calculate total price if not provided
    if (!reservationData.totalPrice) {
      const room = await getRoomById(reservationData.roomId)

      if (!room) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 })
      }

      const startHour = Number.parseInt(reservationData.startTime.split(":")[0])
      const endHour = Number.parseInt(reservationData.endTime.split(":")[0])
      const hours = endHour - startHour

      reservationData.totalPrice = hours * room.pricePerHour
    }

    const newReservation = await createReservation(reservationData)

    return NextResponse.json({ reservation: newReservation }, { status: 201 })
  } catch (error) {
    console.error("Error creating reservation:", error)
    return NextResponse.json({ error: "An error occurred while creating the reservation" }, { status: 500 })
  }
}
