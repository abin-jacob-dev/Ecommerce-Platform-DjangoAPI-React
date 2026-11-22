import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from '../features/auth/authSlice';

function Register() {
    const { loading, error, registeredUser } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const handleRegister = (e) => {
        e.preventDefault()
        dispatch(registerUser({ "email": email, "password": password }))
    }
    return (
        <>
            <div>Register</div>
            <form onSubmit={handleRegister}>
                <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" />
                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" />
                <button>Register</button>
                {loading && <p>Loading...</p>}
                {registeredUser && <p>Registration Successful!</p>}
                {error && <p>{error}</p>}
            </form>

        </>
    )
}

export default Register