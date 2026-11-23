import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../services/api"

export const createCheckout = createAsyncThunk('cart/createCheckout', async ({ product_ids, accessToken }, { rejectWithValue }) => {
    try {
        const response = await api.post('checkout/', { product_ids }, { headers: { Authorization: `Bearer ${accessToken}` } });
        return response.data;

    } catch (error) {
        return rejectWithValue(error.response?.data?.error || "Checkout Failed");
    }

})


const initialState = {
    items: [],
    checkoutLoading: false,
    checkoutError: null,
    checkoutSuccess: false
}
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingProduct = state.items.some(
                item => item.id === action.payload.id
            );

            if (!existingProduct) {
                state.items.push(action.payload);
            }
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload)
        },
        clearCart: (state, action) => {
            state.items = []
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Cart
            .addCase(createCheckout.pending, (state) => {
                state.checkoutLoading = true;
                state.checkoutError = null;
                state.checkoutSuccess = false;
            })
            .addCase(createCheckout.fulfilled, (state, action) => {
                state.checkoutLoading = false;
                state.checkoutSuccess = true;
                state.checkoutError = null;
                state.items = []
            })
            .addCase(createCheckout.rejected, (state, action) => {
                state.checkoutLoading = false;
                state.checkoutError = action.payload || "Checkout Failed";
                state.checkoutSuccess = false;
            });
    }
})

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions

export default cartSlice.reducer