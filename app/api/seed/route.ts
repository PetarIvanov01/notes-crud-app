import { NextResponse } from "next/server"
import { seedDatabase } from "@/lib/seed"

export async function GET() {
  try {
    await seedDatabase()
    return NextResponse.json({ success: true, message: "Database seeding process completed" })
  } catch (error) {
    console.error("Error in seed API route:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}

