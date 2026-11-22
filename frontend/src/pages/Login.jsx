import React, { useState } from 'react'
import { loginUser, fetchProfile } from '../features/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import "./Login.css";
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate()
    const { loading, error, } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const response = await dispatch(loginUser({ email, password })).unwrap()
            const accessToken = response.access

            // console.log(accessToken);

            const profile = await dispatch(fetchProfile(accessToken)).unwrap()
            // console.log("Profile : ", profile);

            navigate('/')
        } catch (error) {
            console.log(error);

        }



    }
    return (
        <main className="form-page">
            <div className="form-card">
                <h2 className="form-title">Login</h2>
                <form onSubmit={handleLogin}>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Email" required />
                    <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Password" required />
                    <button>Login</button>
                    {loading && <p className="form-hint">Loading...</p>}
                    {error && <p className="form-error">{error}</p>}
                </form>
            </div>
        </main>
    )
}

export default Login