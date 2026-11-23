import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../services/api"
import CreateProduct from "../../pages/CreateProduct"

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('products/')
        return response.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed To Fetch the Products")
    }
})
export const fetchMyProducts = createAsyncThunk('products/fetchMyProducts', async (accessToken, { rejectWithValue }) => {
    try {
        const response = await api.get('my_products/', { headers: { Authorization: `Bearer ${accessToken}` } })
        return response.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed To Fetch the MyProducts")
    }
})

export const fetchProductById = createAsyncThunk('products/fetchProductById', async (id, { rejectWithValue }) => {
    try {
        const response = await api.get(`products/${id}/`)
        return response.data

    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed To Fetch the Product")
    }
})


export const createProduct = createAsyncThunk('products/createProduct', async ({ productData, accessToken }, { rejectWithValue }) => {
    try {
        const formData = new FormData()
        formData.append("title", productData.title);
        formData.append("description", productData.description);
        formData.append("price", productData.price);
        formData.append("location", productData.location);
        if (!productData.image) {
            return rejectWithValue("Please upload a product image");
        }
        if (productData.image) {
            formData.append("image", productData.image);
        }

        const response = await api.post(`products/`, formData, { headers: { Authorization: `Bearer ${accessToken}` } })
        return response.data

    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Product Creation Failed ")
    }
})

export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, productData, accessToken }, { rejectWithValue }) => {
    try {
        const formData = new FormData()
        formData.append("title", productData.title);
        formData.append("description", productData.description);
        formData.append("price", productData.price);
        formData.append("location", productData.location);

        if (productData.image) {
            formData.append("image", productData.image);
        }

        const response = await api.patch(`products/${id}/`, formData, { headers: { Authorization: `Bearer ${accessToken}` } })
        return response.data

    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Product Updation Failed ")
    }
})

export const deleteProduct = createAsyncThunk('products/deleteProduct', async ({ id, accessToken }, { rejectWithValue }) => {
    try {

        await api.delete(`products/${id}/`, { headers: { Authorization: `Bearer ${accessToken}` } })
        return id

    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Product Deletion Failed ")
    }
})

const initialState = {
    products: [],
    product: null,
    myProducts: [],
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
            // fetchMyProducts
            .addCase(fetchMyProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchMyProducts.fulfilled, (state, action) => {
                state.loading = false
                state.myProducts = action.payload
            })
            .addCase(fetchMyProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // FetchProductById 
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false
                state.product = action.payload
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // CreateProduct
            .addCase(createProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false
                state.products.push(action.payload)
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // updateProduct
            .addCase(updateProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false
                const index = state.products.findIndex(product => product.id === action.payload.id)
                if (index !== -1) {
                    state.products[index] = action.payload
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // deleteProduct
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false
                state.products = state.products.filter(product => product.id !== action.payload)

            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })


    }
})

// export const  { } =  productsSlice.actions 

export default productsSlice.reducer