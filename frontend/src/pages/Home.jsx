import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { setCredentials, logout } from "../features/auth/authSlice";

function Home() {
    const { isAuthenticated } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const handleLogin = () => {
        dispatch(setCredentials({ user: { "id": 1, "email": "test@demo.com", }, "accessToken": "123", "refreshToken": "121" }))
    }
    const handleLogout = () => {
        dispatch(logout())
    }
    return (
        <>
            <div>Home</div>
            <button onClick={handleLogin}>Login Test</button>
            <button onClick={handleLogout}>Logout Test</button>
            {isAuthenticated ? <h1>Welcome User</h1> : <h1>Please Login</h1>}

        </>
    )
}

export default Home