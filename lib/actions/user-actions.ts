"use server"

import { revalidatePath } from "next/cache"
import { createUser, deleteUser, updateUser } from "@/lib/models/user"
import { getCurrentUser } from "./auth-actions"

export async function addUser(formData: FormData) {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== "admin") {
    return {
      error: "Unauthorized",
    }
  }

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as "client" | "admin"

  if (!name || !email || !password) {
    return {
      error: "Name, email, and password are required",
    }
  }

  try {
    await createUser({
      name,
      email,
      password,
      role: role || "client",
      status: "active",
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error adding user:", error)
    return {
      error: "An error occurred while adding the user",
    }
  }
}

export async function editUser(formData: FormData) {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== "admin") {
    return {
      error: "Unauthorized",
    }
  }

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const role = formData.get("role") as "client" | "admin"
  const status = formData.get("status") as "active" | "inactive"
  const password = formData.get("password") as string | null

  if (!id || !name || !email) {
    return {
      error: "ID, name, and email are required",
    }
  }

  try {
    const updateData: any = {
      name,
      email,
      role,
      status,
    }

    // Only update password if provided
    if (password) {
      updateData.password = password
    }

    await updateUser(id, updateData)

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error updating user:", error)
    return {
      error: "An error occurred while updating the user",
    }
  }
}

export async function removeUser(id: string) {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== "admin") {
    return {
      error: "Unauthorized",
    }
  }

  // Prevent admin from deleting themselves
  if (id === currentUser.id) {
    return {
      error: "You cannot delete your own account",
    }
  }

  try {
    await deleteUser(id)

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    return {
      error: "An error occurred while deleting the user",
    }
  }
}

export async function changeUserRole(id: string, newRole: "client" | "admin") {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== "admin") {
    return {
      error: "Unauthorized",
    }
  }

  try {
    await updateUser(id, { role: newRole })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error changing user role:", error)
    return {
      error: "An error occurred while changing the user role",
    }
  }
}

export async function changeUserStatus(id: string, newStatus: "active" | "inactive") {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== "admin") {
    return {
      error: "Unauthorized",
    }
  }

  try {
    await updateUser(id, { status: newStatus })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error changing user status:", error)
    return {
      error: "An error occurred while changing the user status",
    }
  }
}
