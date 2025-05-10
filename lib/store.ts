import { configureStore } from "@reduxjs/toolkit"
import authReducer from "@/lib/features/auth/authSlice"
import roomsReducer from "@/lib/features/rooms/roomsSlice"
import reservationsReducer from "@/lib/features/reservations/reservationsSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomsReducer,
    reservations: reservationsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
