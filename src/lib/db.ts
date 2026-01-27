import { neon } from "@neondatabase/serverless"

// Create a reusable SQL client
export const sql = neon(process.env.DATABASE_URL!)

export type User = {
  id: number
  email: string
  full_name: string
  password_hash?: string
  role: "user" | "admin" | "moderator"
  created_at: string
}

// Database query helpers
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    console.log("[v0] Querying user by email:", email)
    const users = await sql`
      SELECT * FROM users WHERE email = ${email} LIMIT 1
    `
    console.log("[v0] User found:", users.length > 0)
    return (users[0] as User) || null
  } catch (error) {
    console.error("[v0] Database error in getUserByEmail:", error)
    throw error
  }
}

export async function createUser(
  email: string,
  passwordHash: string,
  fullName: string,
  role: "user" | "admin" | "moderator" = "user",
) {
  try {
    console.log("[v0] Creating user:", email, "with role:", role)
    const users = await sql`
      INSERT INTO users (email, password_hash, full_name, role)
      VALUES (${email}, ${passwordHash}, ${fullName}, ${role})
      RETURNING id, email, full_name, role, created_at
    `
    console.log("[v0] User created successfully:", users[0].id)
    return users[0]
  } catch (error) {
    console.error("[v0] Database error in createUser:", error)
    throw error
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    console.log("[v0] Fetching all users")
    const users = await sql`
      SELECT id, email, full_name, role, created_at FROM users ORDER BY created_at DESC
    `
    console.log("[v0] Found users:", users.length)
    return users as User[]
  } catch (error) {
    console.error("[v0] Database error in getAllUsers:", error)
    throw error
  }
}

export async function updateUserRole(userId: number, newRole: "user" | "admin" | "moderator") {
  try {
    console.log("[v0] Updating user role:", userId, "to", newRole)
    const users = await sql`
      UPDATE users SET role = ${newRole}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
      RETURNING id, email, full_name, role
    `
    console.log("[v0] Role updated successfully")
    return users[0]
  } catch (error) {
    console.error("[v0] Database error in updateUserRole:", error)
    throw error
  }
}
