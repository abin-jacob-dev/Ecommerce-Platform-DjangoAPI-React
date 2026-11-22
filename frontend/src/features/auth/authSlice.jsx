import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.post('register/', userData)
        return response.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Registration Failed")
    }
})


const initialState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    registeredUser: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,

    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user
            state.accessToken = action.payload.accessToken
            state.refreshToken = action.payload.refreshToken
            state.isAuthenticated = true
        },
        logout: (state) => {
            state.user = null
            state.accessToken = null
            state.refreshToken = null
            state.isAuthenticated = false
        },
        setUser: (state, action) => {
            state.user = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.loading = true
            state.error = null
            state.registeredUser = null
        }).addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false
            state.registeredUser = action.payload
            
            
        }).addCase(registerUser.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })
    }
})


export const { setCredentials, logout, setUser } = authSlice.actions

export default authSlice.reducer
