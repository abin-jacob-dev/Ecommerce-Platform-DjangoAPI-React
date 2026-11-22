import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";

import { deleteProduct, fetchProducts } from '../features/products/productSlice';
import { useNavigate } from 'react-router-dom';
import "./Home.css";

const CLOUD_NAME = "campeon-ecommerce";

function MyProducts() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { products, loading, error } = useSelector((state) => state.products)
    const { isAuthenticated, user, accessToken } = useSelector((state) => state.auth)
    const handleDelete = (id) => {
        dispatch(deleteProduct({ id, accessToken }))
    }
    const handleEdit = (id) => {
        navigate(`/products/${id}/edit`)
    }
    useEffect(() => {
        dispatch(fetchProducts())


    }, [accessToken, dispatch])

    return (
        <main>
            <h1 className="page-title">Manage Products</h1>
            <div className="products-grid">
                {user && products.filter(product => String(product.seller) === String(user.id)).map(product => (
                    <div className="product-card" key={product.id}>
                        {product.image && <img src={`https://res.cloudinary.com/${CLOUD_NAME}/${product.image}`} alt={product.title} />}
                        <p>{product.id}. {product.title}</p>
                        <p>{product.description}</p>
                        <p className="price">{product.price}</p>
                        <p>{product.location}</p>
                        <div className="card-actions">
                            <button className="btn-danger" onClick={() => handleDelete(product.id)}>Delete</button>
                            <button onClick={() => handleEdit(product.id)}>Edit</button>
                        </div>
                    </div>
                ))}
            </div>
            {loading && <p className="state-message">Loading Products...</p>}
            {error && <p className="state-message error">{error}</p>}
        </main>
    )
}
export default MyProducts