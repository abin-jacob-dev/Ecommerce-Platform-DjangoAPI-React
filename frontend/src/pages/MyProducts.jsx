import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";

import { deleteProduct, fetchProducts } from '../features/products/productSlice';

const CLOUD_NAME = "campeon-ecommerce";

function MyProducts() {

    const dispatch = useDispatch()
    const { products, loading, error } = useSelector((state) => state.products)
    const { isAuthenticated, user, accessToken } = useSelector((state) => state.auth)
    const handleDelete = (id) => {
        dispatch(deleteProduct({ id, accessToken }))
    }
    useEffect(() => {
        dispatch(fetchProducts())


    }, [accessToken, dispatch])

    return (
        <>
            <div>My Products</div>

            <hr />
            <h1>Manage Products</h1>
            {user && products.filter(product => String(product.seller) === String(user.id)).map(product => (

                <div key={product.id}>
                    {product.image && <img width="150" src={`https://res.cloudinary.com/${CLOUD_NAME}/${product.image}`} alt={product.title} />}
                    <p>{product.id}. {product.title}</p>
                    <p>{product.description}</p>
                    <p>{product.price}</p>
                    <p>{product.location}</p>
                    {/* <p>{product.image}</p> */}
                    <button onClick={() => handleDelete(product.id)}>Delete</button>
                    {/* <Link to={`/products/${product.id}`}>Buy now</Link> */}
                    <hr />
                </div>
            ))}
            {loading && <p>Loading Products...</p>}
            {error && <p>{error}</p>}
        </>
    )
}
export default MyProducts