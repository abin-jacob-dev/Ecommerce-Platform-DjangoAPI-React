import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from '../features/auth/authSlice';
import "./Register.css";

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
        <main className="form-page">
            <div className="form-card">
                <h2 className="form-title">Register</h2>
                <form onSubmit={handleRegister}>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Email" required />
                    <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Password" required />
                    <button>Register</button>
                    {loading && <p className="form-hint">Loading...</p>}
                    {registeredUser && <p className="form-success">Registration Successful!</p>}
                    {error && <p className="form-error">{error}</p>}
                </form>
            </div>
        </main>
    )
}

export default Register