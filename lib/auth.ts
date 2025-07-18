// lib/auth.ts
"use client"

const ADMIN_AUTH_KEY = "makro_admin_logged_in"

export const loginAdmin = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem(ADMIN_AUTH_KEY, "true")
  }
}

export const logoutAdmin = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ADMIN_AUTH_KEY)
  }
}

export const checkAdminAuth = (): boolean => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(ADMIN_AUTH_KEY) === "true"
  }
  return false
}
