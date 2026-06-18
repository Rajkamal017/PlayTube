import { createSlice } from "@reduxjs/toolkit";
// import store from "./store.js"

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        channelData: null
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload
        },
        setChannelData: (state, action) => {
            state.channelData = action.payload
        }
    }
})

export const { setUserData } = userSlice.actions
export const { setChannelData } = userSlice.actions
export default userSlice.reducer