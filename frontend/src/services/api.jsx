import axios from 'axios'
// import store from '../app/store'
// import { updateAccessToken, logout } from '../features/auth/authSlice'

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
    // headers: {
    //     "Content-type": 'application/json'
    // },
})
export const setupInterceptors = (store) => {

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config
            const refreshToken = store.getState().auth.refreshToken

            if (error.response?.status === 401 &&
                refreshToken &&
                !originalRequest._retry) {

                originalRequest._retry = true
                try {
                    const response = await axios.post('http://localhost:8000/api/token/refresh/', { refresh: refreshToken })
                    const newAccessToken = response.data.access
                    const newRefreshToken = response.data.refresh
                    // store.dispatch(updateAccessToken(newAccessToken))
                    store.dispatch({ type: 'auth/updateAccessToken', payload: newAccessToken })
                    if (newRefreshToken){
                        store.dispatch({ type: 'auth/updateRefreshToken', payload: newRefreshToken })
                    }
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                    return api(originalRequest)

                } catch (refreshError) {
                    // store.dispatch(logout())
                    store.dispatch({ type: 'auth/logout' })
                    return Promise.reject(refreshError)
                }
            }

            return Promise.reject(error)
        }
    )
}


export default api