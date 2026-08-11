"use client"

import { redirect } from "next/navigation"
import { useUser } from "@/hooks/useUser"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user, loading } = useUser()

  if (loading) return <LoadingSpinner />

  if (user) {
    redirect("/heists")
    return null // utile uniquement en test, où redirect() est mocké
  }

  return <main className="public">{children}</main>
}
