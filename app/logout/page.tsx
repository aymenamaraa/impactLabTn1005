"use client"

import { useEffect } from "react"
import { logout } from "@/lib/actions/auth-actions"

export default function LogoutPage() {
  useEffect(() => {
    const performLogout = async () => {
      await logout()
    }

    performLogout()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Logging out...</p>
    </div>
  )
}
