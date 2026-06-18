import { configureStore } from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import contentSlice from "./contentSlice"

export const store = configureStore({
    reducer: {
        user: userSlice,
        content: contentSlice
    }
})