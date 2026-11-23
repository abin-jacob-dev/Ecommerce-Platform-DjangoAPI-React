import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchProductById } from '../features/products/productSlice'
import { addToCart } from '../features/cart/cartSlice'
import "./ProductDetails.css";

const CLOUD_NAME = "campeon-ecommerce";

function ProductDetails() {
    const { product, loading, error } = useSelector((state) => state.products)
    const { id } = useParams()
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchProductById(id))
    }, [id, dispatch])
    const handleAddToCart = (product) => {
        dispatch(addToCart(product))
    }
    return (
        <main>
            <h1 className="page-title">Product Details</h1>
            {loading && <p className="state-message">Loading Product...</p>}
            {error && <p className="state-message error">{error}</p>}
            {product && <div className="product-detail">
                <p className="detail-title">{product.title}</p>
                {product.image && <img src={`https://res.cloudinary.com/${CLOUD_NAME}/${product.image}`} alt={product.title} />}
                <p>{product.description}</p>
                <p className="detail-price">{product.price}</p>
                <p className="detail-location">{product.location}</p>
                <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
            </div>}
        </main>
    )
}

export default ProductDetails