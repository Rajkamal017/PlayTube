import { createSlice } from "@reduxjs/toolkit";
// import store from "./store.js"

const userSlice = createSlice({
    name:"user",
    initialState:{
        userData: null
    },
    reducers:{
        setUserData:(state, action)=>{
            state.userData = action.payload
        }
    }
})

export const {setUserData} = userSlice.actions
export default userSlice.reducer