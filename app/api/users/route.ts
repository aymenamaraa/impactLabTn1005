import { type NextRequest, NextResponse } from "next/server"
import { createUser, getAllUsers } from "@/lib/models/user"

export async function GET() {
  try {
    const users = await getAllUsers()
    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "An error occurred while fetching users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    if (!userData.name || !userData.email || !userData.password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Set default role to client if not specified
    if (!userData.role) {
      userData.role = "client"
    }

    // Set default status to active if not specified
    if (!userData.status) {
      userData.status = "active"
    }

    const newUser = await createUser(userData)

    return NextResponse.json({ user: newUser }, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "An error occurred while creating the user" }, { status: 500 })
  }
}
