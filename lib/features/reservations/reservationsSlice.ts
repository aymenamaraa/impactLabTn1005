import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type Reservation = {
  id: string
  roomId: string
  userId: string
  date: string
  startTime: string
  endTime: string
  status: "pending" | "confirmed" | "cancelled"
  totalPrice: number
  createdAt: string
}

type ReservationsState = {
  reservations: Reservation[]
  userReservations: Reservation[]
  loading: boolean
  error: string | null
}

const initialState: ReservationsState = {
  reservations: [],
  userReservations: [],
  loading: false,
  error: null,
}

const reservationsSlice = createSlice({
  name: "reservations",
  initialState,
  reducers: {
    fetchReservationsStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchReservationsSuccess: (state, action: PayloadAction<Reservation[]>) => {
      state.reservations = action.payload
      state.loading = false
    },
    fetchUserReservationsSuccess: (state, action: PayloadAction<Reservation[]>) => {
      state.userReservations = action.payload
      state.loading = false
    },
    fetchReservationsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    addReservation: (state, action: PayloadAction<Reservation>) => {
      state.reservations.push(action.payload)
      state.userReservations.push(action.payload)
    },
    updateReservation: (state, action: PayloadAction<Reservation>) => {
      const index = state.reservations.findIndex((r) => r.id === action.payload.id)
      if (index !== -1) {
        state.reservations[index] = action.payload
      }

      const userIndex = state.userReservations.findIndex((r) => r.id === action.payload.id)
      if (userIndex !== -1) {
        state.userReservations[userIndex] = action.payload
      }
    },
    cancelReservation: (state, action: PayloadAction<string>) => {
      const reservation = state.reservations.find((r) => r.id === action.payload)
      if (reservation) {
        reservation.status = "cancelled"
      }

      const userReservation = state.userReservations.find((r) => r.id === action.payload)
      if (userReservation) {
        userReservation.status = "cancelled"
      }
    },
  },
})

export const {
  fetchReservationsStart,
  fetchReservationsSuccess,
  fetchUserReservationsSuccess,
  fetchReservationsFailure,
  addReservation,
  updateReservation,
  cancelReservation,
} = reservationsSlice.actions
export default reservationsSlice.reducer
