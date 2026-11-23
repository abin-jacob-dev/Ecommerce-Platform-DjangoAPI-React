import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";

import { deleteProduct, fetchMyProducts } from '../features/products/productSlice';
import { useNavigate } from 'react-router-dom';
import "./Home.css";

const CLOUD_NAME = "campeon-ecommerce";

function MyProducts() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loading, error, myProducts } = useSelector((state) => state.products)
    const { accessToken, user } = useSelector((state) => state.auth)
    const handleDelete = (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        )

        if (confirmDelete) {
            dispatch(deleteProduct({ id, accessToken }))
        }
        
    }
    const handleEdit = (id) => {
        navigate(`/products/${id}/edit`)
    }
    useEffect(() => {
        dispatch(fetchMyProducts(accessToken))


    }, [accessToken, dispatch])

    return (
        <main>
            <h1 className="page-title">Manage Products</h1>
            <div className="products-grid">
                {user && myProducts.map(product => (
                    <div className="product-card" key={product.id}>
                        {product.image && <img src={`https://res.cloudinary.com/${CLOUD_NAME}/${product.image}`} alt={product.title} />}
                        <p>{product.id}. {product.title}</p>
                        <span className={`sold-badge${product.is_sold ? ' is-sold' : ' is-available'}`}>
                            {product.is_sold ? 'SOLD OUT' : 'AVAILABLE'}
                        </span>
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