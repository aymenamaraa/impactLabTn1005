"use server"

import { revalidatePath } from "next/cache"
import { createReservation, deleteReservation, updateReservation } from "@/lib/models/reservation"
import { getRoomById } from "@/lib/models/room"
import { getCurrentUser } from "./auth-actions"

export async function addReservation(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      error: "You must be logged in to make a reservation",
    }
  }

  const roomId = formData.get("roomId") as string
  const date = formData.get("date") as string
  const startTime = formData.get("startTime") as string
  const endTime = formData.get("endTime") as string

  if (!roomId || !date || !startTime || !endTime) {
    return {
      error: "Room, date, start time, and end time are required",
    }
  }

  try {
    // Get room details to calculate price
    const room = await getRoomById(roomId)

    if (!room) {
      return {
        error: "Room not found",
      }
    }

    // Calculate total price
    const startHour = Number.parseInt(startTime.split(":")[0])
    const endHour = Number.parseInt(endTime.split(":")[0])
    const hours = endHour - startHour
    const totalPrice = hours * room.pricePerHour

    // Create reservation
    await createReservation({
      roomId,
      userId: user.id,
      date,
      startTime,
      endTime,
      status: "pending",
      totalPrice,
    })

    revalidatePath("/rooms")
    return { success: true }
  } catch (error) {
    console.error("Error adding reservation:", error)
    return {
      error: "An error occurred while adding the reservation",
    }
  }
}

export async function updateReservationStatus(id: string, newStatus: "pending" | "confirmed" | "cancelled") {
  const user = await getCurrentUser()

  if (!user) {
    return {
      error: "You must be logged in to update a reservation",
    }
  }

  try {
    await updateReservation(id, { status: newStatus })

    revalidatePath("/admin/reservations")
    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Error updating reservation status:", error)
    return {
      error: "An error occurred while updating the reservation status",
    }
  }
}

export async function cancelReservation(id: string) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      error: "You must be logged in to cancel a reservation",
    }
  }

  try {
    await updateReservation(id, { status: "cancelled" })

    revalidatePath("/admin/reservations")
    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Error cancelling reservation:", error)
    return {
      error: "An error occurred while cancelling the reservation",
    }
  }
}

export async function removeReservation(id: string) {
  const user = await getCurrentUser()

  if (!user || user.role !== "admin") {
    return {
      error: "Unauthorized",
    }
  }

  try {
    await deleteReservation(id)

    revalidatePath("/admin/reservations")
    return { success: true }
  } catch (error) {
    console.error("Error deleting reservation:", error)
    return {
      error: "An error occurred while deleting the reservation",
    }
  }
}
