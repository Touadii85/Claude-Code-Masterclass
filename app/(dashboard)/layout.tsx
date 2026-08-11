"use client"

import { redirect } from "next/navigation"
import { useUser } from "@/hooks/useUser"
import LoadingSpinner from "@/components/LoadingSpinner"
// composants
import Navbar from "@/components/Navbar"

export default function HeistsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user, loading } = useUser()

  if (loading) return <LoadingSpinner />

  if (!user) {
    redirect("/login")
    return null // utile uniquement en test, où redirect() est mocké
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}
