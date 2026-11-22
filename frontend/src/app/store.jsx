import { configureStore } from "@reduxjs/toolkit";
import authSlicer from "../features/auth/authSlice"
import productsSlicer from "../features/products/productSlice";

const store = configureStore({
    reducer: {
        auth: authSlicer,
        products: productsSlicer
    }
})

export default store 