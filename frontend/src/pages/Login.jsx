import React, { useState } from 'react'
import { loginUser, fetchProfile } from '../features/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux'

function Login() {
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


        } catch (error) {
            console.log(error);

        }



    }
    return (
        <>
            <div>Login</div>
            <form onSubmit={handleLogin}>
                <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" />
                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" />
                <button>Login</button>
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
            </form>

        </>
    )
}

export default Login