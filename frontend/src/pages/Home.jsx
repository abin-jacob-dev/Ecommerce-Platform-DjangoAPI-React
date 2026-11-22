import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { fetchProducts } from '../features/products/productSlice';
import { Link } from "react-router-dom";

const CLOUD_NAME = "campeon-ecommerce";

function Home() {
    const dispatch = useDispatch()
    const { products, loading, error } = useSelector((state) => state.products)
    useEffect(() => {
        dispatch(fetchProducts())


    }, [])

    const { isAuthenticated, user, accessToken, refreshToken } = useSelector((state) => state.auth)

    const handleLogout = () => {
        dispatch(logoutUser({ accessToken, refreshToken }))
    }
    return (
        <>
            <div>Home</div>
            {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
            {isAuthenticated ? <h1>Welcome User</h1> : <h1>Please Login</h1>}
            <hr />
            <h1>Products</h1>
            {products.map(product => (

                <div key={product.id}>
                    {product.image && <img width="150" src={`https://res.cloudinary.com/${CLOUD_NAME}/${product.image}`} alt={product.title} />}
                    <p>{product.id}. {product.title}</p>
                    <p>{product.description}</p>
                    <p>{product.price}</p>
                    <p>{product.location}</p>
                    {/* <p>{product.image}</p> */}
                    <Link to={`/products/${product.id}`}>Buy now</Link>
                    <hr />
                </div>
            ))}
            {loading && <p>Loading Products...</p>}
            {error && <p>{error}</p>}
        </>
    )
}

export default Home