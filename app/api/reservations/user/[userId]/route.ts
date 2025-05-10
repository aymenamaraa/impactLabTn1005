import { type NextRequest, NextResponse } from "next/server"
import { getReservationsByUserId } from "@/lib/models/reservation"
import { getRoomById } from "@/lib/models/room"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId
    const reservations = await getReservationsByUserId(userId)

    // Fetch room details for each reservation
    const reservationsWithDetails = await Promise.all(
      reservations.map(async (reservation) => {
        const room = await getRoomById(reservation.roomId)

        return {
          ...reservation,
          roomName: room?.name || "Unknown Room",
        }
      }),
    )

    return NextResponse.json({ reservations: reservationsWithDetails })
  } catch (error) {
    console.error("Error fetching user reservations:", error)
    return NextResponse.json({ error: "An error occurred while fetching user reservations" }, { status: 500 })
  }
}
