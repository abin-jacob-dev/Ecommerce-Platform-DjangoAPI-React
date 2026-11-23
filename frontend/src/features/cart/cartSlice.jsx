import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../services/api"
import CreateProduct from "../../pages/CreateProduct"

// export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
//     try {
//         const response = await api.get('products/')
//         return response.data
//     } catch (error) {
//         return rejectWithValue(error.response?.data?.message || "Failed To Fetch the Products")
//     }
// })
// export const fetchMyProducts = createAsyncThunk('products/fetchMyProducts', async (accessToken, { rejectWithValue }) => {
//     try {
//         const response = await api.get('my_products/', { headers: { Authorization: `Bearer ${accessToken}` } })
//         return response.data
//     } catch (error) {
//         return rejectWithValue(error.response?.data?.message || "Failed To Fetch the MyProducts")
//     }
// })

// export const fetchProductById = createAsyncThunk('products/fetchProductById', async (id, { rejectWithValue }) => {
//     try {
//         const response = await api.get(`products/${id}/`)
//         return response.data

//     } catch (error) {
//         return rejectWithValue(error.response?.data?.message || "Failed To Fetch the Product")
//     }
// })


// export const createProduct = createAsyncThunk('products/createProduct', async ({ productData, accessToken }, { rejectWithValue }) => {
//     try {
//         const formData = new FormData()
//         formData.append("title", productData.title);
//         formData.append("description", productData.description);
//         formData.append("price", productData.price);
//         formData.append("location", productData.location);
//         if (!productData.image) {
//             return rejectWithValue("Please upload a product image");
//         }
//         if (productData.image) {
//             formData.append("image", productData.image);
//         }

//         const response = await api.post(`products/`, formData, { headers: { Authorization: `Bearer ${accessToken}` } })
//         return response.data

//     } catch (error) {
//         return rejectWithValue(error.response?.data?.message || "Product Creation Failed ")
//     }
// })

// export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, productData, accessToken }, { rejectWithValue }) => {
//     try {
//         const formData = new FormData()
//         formData.append("title", productData.title);
//         formData.append("description", productData.description);
//         formData.append("price", productData.price);
//         formData.append("location", productData.location);

//         if (productData.image) {
//             formData.append("image", productData.image);
//         }

//         const response = await api.patch(`products/${id}/`, formData, { headers: { Authorization: `Bearer ${accessToken}` } })
//         return response.data

//     } catch (error) {
//         return rejectWithValue(error.response?.data?.message || "Product Updation Failed ")
//     }
// })

// export const deleteProduct = createAsyncThunk('products/deleteProduct', async ({ id, accessToken }, { rejectWithValue }) => {
//     try {

//         await api.delete(`products/${id}/`, { headers: { Authorization: `Bearer ${accessToken}` } })
//         return id

//     } catch (error) {
//         return rejectWithValue(error.response?.data?.message || "Product Deletion Failed ")
//     }
// })

const initialState = {
    items: []
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
    }
})

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions

export default cartSlice.reducer