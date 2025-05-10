import { ObjectId } from "mongodb"
import clientPromise from "../mongodb"

export interface Room {
  _id?: ObjectId
  name: string
  description: string
  type: string
  capacity: string
  pricePerHour: number
  amenities: string[]
  images: string[]
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
}

export interface RoomWithId extends Omit<Room, "_id"> {
  id: string
}

export async function getRoomsCollection() {
  const client = await clientPromise
  const db = client.db("impactlab")
  return db.collection<Room>("rooms")
}

export async function getAllRooms(): Promise<RoomWithId[]> {
  const roomsCollection = await getRoomsCollection()
  const rooms = await roomsCollection.find().toArray()

  return rooms.map((room) => ({
    ...room,
    id: room._id!.toString(),
    _id: undefined,
  }))
}

export async function getRoomById(id: string): Promise<RoomWithId | null> {
  const roomsCollection = await getRoomsCollection()
  const room = await roomsCollection.findOne({ _id: new ObjectId(id) })

  if (!room) return null

  return {
    ...room,
    id: room._id!.toString(),
    _id: undefined,
  }
}

export async function createRoom(roomData: Omit<Room, "_id" | "createdAt" | "updatedAt">): Promise<RoomWithId> {
  const roomsCollection = await getRoomsCollection()

  const newRoom = {
    ...roomData,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await roomsCollection.insertOne(newRoom)

  return {
    ...newRoom,
    id: result.insertedId.toString(),
    _id: undefined,
  }
}

export async function updateRoom(id: string, roomData: Partial<Room>): Promise<RoomWithId | null> {
  const roomsCollection = await getRoomsCollection()

  const updateData = {
    ...roomData,
    updatedAt: new Date(),
  }

  const result = await roomsCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: "after" },
  )

  if (!result) return null

  return {
    ...result,
    id: result._id!.toString(),
    _id: undefined,
  }
}

export async function deleteRoom(id: string): Promise<boolean> {
  const roomsCollection = await getRoomsCollection()
  const result = await roomsCollection.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount === 1
}

// Create initial rooms if none exist
export async function createInitialRooms() {
  const roomsCollection = await getRoomsCollection()
  const count = await roomsCollection.countDocuments()

  if (count === 0) {
    const initialRooms = [
      {
        name: "Executive Office",
        description: "A private office for executives and small teams.",
        type: "Private Office",
        capacity: "1-3",
        pricePerHour: 35,
        amenities: ["WiFi", "Coffee", "Printer"],
        images: ["/placeholder.svg?height=200&width=300"],
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Conference Room",
        description: "A spacious meeting room for team gatherings and client presentations.",
        type: "Meeting Room",
        capacity: "6-10",
        pricePerHour: 75,
        amenities: ["WiFi", "AV Equipment", "Whiteboard"],
        images: ["/placeholder.svg?height=200&width=300"],
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Workshop Area",
        description: "A versatile space for workshops, events, and large gatherings.",
        type: "Event Space",
        capacity: "Up to 30",
        pricePerHour: 150,
        amenities: ["WiFi", "AV Equipment", "Catering"],
        images: ["/placeholder.svg?height=200&width=300"],
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Flex Desk",
        description: "A hot desk for individual work in a collaborative environment.",
        type: "Hot Desk",
        capacity: "1",
        pricePerHour: 15,
        amenities: ["WiFi", "Coffee", "Printer"],
        images: ["/placeholder.svg?height=200&width=300"],
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Team Office",
        description: "A dedicated office space for medium-sized teams.",
        type: "Private Office",
        capacity: "4-8",
        pricePerHour: 60,
        amenities: ["WiFi", "Coffee", "Printer"],
        images: ["/placeholder.svg?height=200&width=300"],
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Meeting Pod",
        description: "A small meeting room for quick discussions and interviews.",
        type: "Meeting Room",
        capacity: "2-4",
        pricePerHour: 40,
        amenities: ["WiFi", "Whiteboard", "Coffee"],
        images: ["/placeholder.svg?height=200&width=300"],
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await roomsCollection.insertMany(initialRooms)
    console.log("Initial rooms created")
  }
}
