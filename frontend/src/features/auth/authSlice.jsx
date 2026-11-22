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

export const loginUser = createAsyncThunk('auth/loginUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.post('login/', userData)
        return response.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Login Failed")
    }
})

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (accessToken, { rejectWithValue }) => {
    try {
        const response = await api.get('profile/', { headers: { Authorization: `Bearer ${accessToken}` } })
        return response.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Profile Fetch Failed")
    }
})

export const logoutUser = createAsyncThunk('auth/logoutUser', async ({ accessToken, refreshToken }, { rejectWithValue }) => {
    try {
        const response = await api.post('logout/', { refresh: refreshToken }, { headers: { Authorization: `Bearer ${accessToken}` } })
        return response.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Logout Failed")
    }

})


const initialState = {
    user: null,
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: false,
    loading: false,
    error: null,
    registeredUser: null,
    authInitialized: false
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
        },
        finishAuthInitialization: (state) => {
            state.authInitialized = true
        }
    },
    extraReducers: (builder) => {
        // Register 
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true
                state.error = null
                state.registeredUser = null
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false
                state.registeredUser = action.payload


            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null

            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.accessToken = action.payload.access
                state.refreshToken = action.payload.refresh
                localStorage.setItem('accessToken', state.accessToken)
                localStorage.setItem('refreshToken', state.refreshToken)
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // FetchProfile
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true
                state.error = null

            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
                state.isAuthenticated = true
                state.authInitialized = true
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
                state.authInitialized = true
            })
            // Logout
            .addCase(logoutUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false
                state.accessToken = null
                state.refreshToken = null
                state.user = null
                state.isAuthenticated = false
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

    }
})


export const { setCredentials, logout, setUser, finishAuthInitialization } = authSlice.actions

export default authSlice.reducer
