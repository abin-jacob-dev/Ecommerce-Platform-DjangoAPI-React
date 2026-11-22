import { useSelector } from "react-redux";
import React from 'react'
import { Navigate, Outlet } from "react-router-dom";


function ProtectedRoute() {
    const { isAuthenticated, authInitialized } = useSelector((state) => state.auth)
    console.log(authInitialized);

    if (!authInitialized) {
        return (<p>Loading...</p>)
    }
    return (
        <>
            {isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />}
        </>
    )
}

export default ProtectedRoute


