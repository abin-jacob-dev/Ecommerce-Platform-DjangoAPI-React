import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../services/api"

export const fetchProducts = createAsyncThunk('fetchProducts', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('products/')
        return response.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message)
    }
})

const initialState = {
    products: [],
    product: null,
    loading: false,
    error: null
}
const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            // fetchProducts
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false
                state.products = action.payload
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

    }
})

// export const  { } =  productsSlice.actions 

export default productsSlice.reducer