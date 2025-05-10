import { NextResponse } from "next/server"
import { createInitialAdminUser } from "@/lib/models/user"
import { createInitialRooms } from "@/lib/models/room"

export async function GET() {
  try {
    // Create initial admin user
    await createInitialAdminUser()

    // Create initial rooms
    await createInitialRooms()

    return NextResponse.json({
      success: true,
      message: "Database initialized with admin user and sample rooms",
    })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json({ error: "An error occurred while initializing the database" }, { status: 500 })
  }
}
