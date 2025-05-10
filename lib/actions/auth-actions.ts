"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createUser, findUserByEmail, verifyPassword } from "@/lib/models/user"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return {
      error: "Email and password are required",
    }
  }

    const user = await findUserByEmail(email)

    if (!user) {
      return {
        error: "Invalid email or password",
      }
    }

    const isPasswordValid = await verifyPassword(user, password)

    if (!isPasswordValid) {
      return {
        error: "Invalid email or password",
      }
    }

    // Don't include password in the user object
    const { password: _, ...userWithoutPassword } = user

    // Store user info in a cookie (in a real app, use a proper session management system)
    // cookies().set(
    //   "user",
    //   JSON.stringify({
    //     ...userWithoutPassword,
    //     id: user._id!.toString(),
    //   }),
    //   {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    //     maxAge: 60 * 60 * 24 * 7, // 1 week
    //     path: "/",
    //   },
    // )

    // Redirect based on user role
    console.log("🚀 ~ login ~ user:", user)

    if (user.role === "admin") {
      redirect("/admin")
    } else {
      redirect("/rooms")
    }

}

export async function register(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!name || !email || !password || !confirmPassword) {
    return {
      error: "All fields are required",
    }
  }

  if (password !== confirmPassword) {
    return {
      error: "Passwords do not match",
    }
  }

  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(email)

    if (existingUser) {
      return {
        error: "Email already in use",
      }
    }

    // Create new user with client role
    await createUser({
      name,
      email,
      password,
      role: "client",
      status: "active",
    })

    redirect("/login?registered=true")
  } catch (error) {
    console.error("Registration error:", error)
    redirect("/login?registered=true")

    // return {
    //   error: "An error occurred during registration",
    // }
  }
}

export async function logout() {
  cookies().delete("user")
  redirect("/login")
}

export async function getCurrentUser() {
  const userCookie = cookies().get("user")

  if (!userCookie) {
    return null
  }

  try {
    return JSON.parse(userCookie.value)
  } catch {
    return null
  }
}
