import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";

function Home() {
    const { isAuthenticated, user, accessToken, refreshToken } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logoutUser({ accessToken, refreshToken }))
    }
    return (
        <>
            <div>Home</div>
            {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
            {isAuthenticated ? <h1>Welcome User</h1> : <h1>Please Login</h1>}

        </>
    )
}

export default Home