import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"
import clientPromise from "../mongodb"

export type UserRole = "client" | "admin"

export interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  role: UserRole
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
}

export interface UserWithoutPassword {
  _id?: ObjectId
  id: string
  name: string
  email: string
  role: UserRole
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
}

export async function getUsersCollection() {
  const client = await clientPromise
  const db = client.db("impactlab")
  return db.collection<User>("users")
}

export async function createInitialAdminUser() {
  const usersCollection = await getUsersCollection()

  // Check if admin user already exists
  const adminUser = await usersCollection.findOne({ email: "admin@example.com" })

  if (!adminUser) {
    // Create admin user if it doesn't exist
    const hashedPassword = await bcrypt.hash("password", 10)

    await usersCollection.insertOne({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log("Initial admin user created")
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const usersCollection = await getUsersCollection()
  return usersCollection.findOne({ email })
}

export async function findUserById(id: string): Promise<User | null> {
  const usersCollection = await getUsersCollection()
  return usersCollection.findOne({ _id: new ObjectId(id) })
}

export async function createUser(
  userData: Omit<User, "_id" | "createdAt" | "updatedAt">,
): Promise<UserWithoutPassword> {
  const usersCollection = await getUsersCollection()

  // Hash the password
  const hashedPassword = await bcrypt.hash(userData.password, 10)

  const newUser = {
    ...userData,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await usersCollection.insertOne(newUser)

  const { password, ...userWithoutPassword } = newUser
  return {
    ...userWithoutPassword,
    id: result.insertedId.toString(),
  }
}

export async function updateUser(id: string, userData: Partial<User>): Promise<UserWithoutPassword | null> {
  const usersCollection = await getUsersCollection()

  // If password is being updated, hash it
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10)
  }

  const updateData = {
    ...userData,
    updatedAt: new Date(),
  }

  const result = await usersCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: "after" },
  )

  if (!result) return null

  const { password, ...userWithoutPassword } = result
  return {
    ...userWithoutPassword,
    id: result._id!.toString(),
  }
}

export async function getAllUsers(): Promise<UserWithoutPassword[]> {
  const usersCollection = await getUsersCollection()
  const users = await usersCollection.find().toArray()

  return users.map((user) => {
    const { password, ...userWithoutPassword } = user
    return {
      ...userWithoutPassword,
      id: user._id!.toString(),
    }
  })
}

export async function deleteUser(id: string): Promise<boolean> {
  const usersCollection = await getUsersCollection()
  const result = await usersCollection.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount === 1
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.password)
}
