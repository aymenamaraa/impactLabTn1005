"use server"

import { revalidatePath } from "next/cache"
import { createRoom, deleteRoom, updateRoom } from "@/lib/models/room"
import { getCurrentUser } from "./auth-actions"

export async function addRoom(formData: FormData) {
  const user = await getCurrentUser()

  if (!user || user.role !== "admin") {
    return {
      error: "Unauthorized",
    }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const type = formData.get("type") as string
  const capacity = formData.get("capacity") as string
  const pricePerHour = Number.parseFloat(formData.get("pricePerHour") as string)
  const amenitiesString = formData.get("amenities") as string

  if (!name || !type || !capacity || isNaN(pricePerHour)) {
    return {
      error: "Name, type, capacity, and price per hour are required",
    }
  }

  const amenities = amenitiesString
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)

  try {
    await createRoom({
      name,
      description: description || "",
      type,
      capacity,
      pricePerHour,
      amenities,
      images: ["/placeholder.svg?height=200&width=300"],
      status: "active",
    })

    revalidatePath("/admin/rooms")
    return { success: true }
  } catch (error) {
    console.error("Error adding room:", error)
    return {
      error: "An error occurred while adding the room",
    }
  }
}

export async function editRoom(formData: FormData) {
  const user = await getCurrentUser()

  if (!user || user.role !== "admin") {
    return {
      error: "Unauthorized",
    }
  }

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const type = formData.get("type") as string
  const capacity = formData.get("capacity") as string
  const pricePerHour = Number.parseFloat(formData.get("pricePerHour") as string)
  const amenitiesString = formData.get("amenities") as string
  const status = formData.get("status") as "active" | "inactive"

  if (!id || !name || !type || !capacity || isNaN(pricePerHour)) {
    return {
      error: "ID, name, type, capacity, and price per hour are required",
    }
  }

  const amenities = amenitiesString
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)

  try {
    await updateRoom(id, {
      name,
      description,
      type,
      capacity,
      pricePerHour,
      amenities,
      status,
    })

    revalidatePath("/admin/rooms")
    return { success: true }
  } catch (error) {
    console.error("Error updating room:", error)
    return {
      error: "An error occurred while updating the room",
    }
  }
}

export async function removeRoom(id: string) {
  const user = await getCurrentUser()

  if (!user || user.role !== "admin") {
    return {
      error: "Unauthorized",
    }
  }

  try {
    await deleteRoom(id)

    revalidatePath("/admin/rooms")
    return { success: true }
  } catch (error) {
    console.error("Error deleting room:", error)
    return {
      error: "An error occurred while deleting the room",
    }
  }
}
