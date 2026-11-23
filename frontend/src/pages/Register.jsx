import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from '../features/auth/authSlice';
import "./Register.css";
import { useForm } from 'react-hook-form';

function Register() {
    const { loading, error, registeredUser } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    // const [email, setEmail] = useState("")
    // const [password, setPassword] = useState("")
    const { register, handleSubmit, formState } = useForm()
    const { errors } = formState
    const onSubmit = (data) => {


        dispatch(registerUser(data))
    }
    return (
        <main className="form-page">
            <div className="form-card">
                <h2 className="form-title">Register</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input {...register('email', { required: { value: true, message: 'Email is required' }, pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" } })} type="email" placeholder="Email" />
                    {errors.email && <p>{errors.email?.message}</p>}
                    <input  {...register('password', { required: { value: true, message: "Password is required" }, minLength: { value: 8, message: "Password must be at least 8 characters" } })} type="password" placeholder="Password" />
                    {errors.password && <p>{errors.password?.message}</p>}
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