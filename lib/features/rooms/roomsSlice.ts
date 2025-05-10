import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type Room = {
  id: string
  name: string
  description: string
  capacity: number
  pricePerHour: number
  amenities: string[]
  images: string[]
  availability: {
    [date: string]: {
      [hour: string]: boolean
    }
  }
}

type RoomsState = {
  rooms: Room[]
  selectedRoom: Room | null
  loading: boolean
  error: string | null
}

const initialState: RoomsState = {
  rooms: [],
  selectedRoom: null,
  loading: false,
  error: null,
}

const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    fetchRoomsStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchRoomsSuccess: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload
      state.loading = false
    },
    fetchRoomsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    selectRoom: (state, action: PayloadAction<string>) => {
      state.selectedRoom = state.rooms.find((room) => room.id === action.payload) || null
    },
    clearSelectedRoom: (state) => {
      state.selectedRoom = null
    },
  },
})

export const { fetchRoomsStart, fetchRoomsSuccess, fetchRoomsFailure, selectRoom, clearSelectedRoom } =
  roomsSlice.actions
export default roomsSlice.reducer
