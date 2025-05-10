import { ObjectId } from "mongodb"
import clientPromise from "../mongodb"

export interface Reservation {
  _id?: ObjectId
  roomId: string
  userId: string
  date: string
  startTime: string
  endTime: string
  status: "pending" | "confirmed" | "cancelled"
  totalPrice: number
  createdAt: Date
  updatedAt: Date
}

export interface ReservationWithId extends Omit<Reservation, "_id"> {
  id: string
}

export interface ReservationWithDetails extends ReservationWithId {
  roomName: string
  userName: string
}

export async function getReservationsCollection() {
  const client = await clientPromise
  const db = client.db("impactlab")
  return db.collection<Reservation>("reservations")
}

export async function getAllReservations(): Promise<ReservationWithId[]> {
  const reservationsCollection = await getReservationsCollection()
  const reservations = await reservationsCollection.find().toArray()

  return reservations.map((reservation) => ({
    ...reservation,
    id: reservation._id!.toString(),
    _id: undefined,
  }))
}

export async function getReservationById(id: string): Promise<ReservationWithId | null> {
  const reservationsCollection = await getReservationsCollection()
  const reservation = await reservationsCollection.findOne({ _id: new ObjectId(id) })

  if (!reservation) return null

  return {
    ...reservation,
    id: reservation._id!.toString(),
    _id: undefined,
  }
}

export async function getReservationsByUserId(userId: string): Promise<ReservationWithId[]> {
  const reservationsCollection = await getReservationsCollection()
  const reservations = await reservationsCollection.find({ userId }).toArray()

  return reservations.map((reservation) => ({
    ...reservation,
    id: reservation._id!.toString(),
    _id: undefined,
  }))
}

export async function getReservationsByRoomId(roomId: string): Promise<ReservationWithId[]> {
  const reservationsCollection = await getReservationsCollection()
  const reservations = await reservationsCollection.find({ roomId }).toArray()

  return reservations.map((reservation) => ({
    ...reservation,
    id: reservation._id!.toString(),
    _id: undefined,
  }))
}

export async function createReservation(
  reservationData: Omit<Reservation, "_id" | "createdAt" | "updatedAt">,
): Promise<ReservationWithId> {
  const reservationsCollection = await getReservationsCollection()

  const newReservation = {
    ...reservationData,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await reservationsCollection.insertOne(newReservation)

  return {
    ...newReservation,
    id: result.insertedId.toString(),
    _id: undefined,
  }
}

export async function updateReservation(
  id: string,
  reservationData: Partial<Reservation>,
): Promise<ReservationWithId | null> {
  const reservationsCollection = await getReservationsCollection()

  const updateData = {
    ...reservationData,
    updatedAt: new Date(),
  }

  const result = await reservationsCollection.findOneAndUpdate(
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

export async function deleteReservation(id: string): Promise<boolean> {
  const reservationsCollection = await getReservationsCollection()
  const result = await reservationsCollection.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount === 1
}
