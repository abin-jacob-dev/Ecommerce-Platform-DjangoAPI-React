import { configureStore } from "@reduxjs/toolkit";
import authSlicer from "../features/auth/authSlice"

const store = configureStore({
    reducer: {
        auth: authSlicer
    }
})

export default store 