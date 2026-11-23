import { configureStore } from "@reduxjs/toolkit";
import authSlicer from "../features/auth/authSlice"
import productsSlicer from "../features/products/productSlice";
import cartSlicer from '../features/cart/cartSlice'

const store = configureStore({
    reducer: {
        auth: authSlicer,
        products: productsSlicer,
        cart: cartSlicer
    }
})

export default store 