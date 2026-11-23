import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from '../features/products/productSlice';
import { Link } from "react-router-dom";
import "./Home.css";
import { addToCart } from '../features/cart/cartSlice';

const CLOUD_NAME = "campeon-ecommerce";

function Home() {
    const dispatch = useDispatch()
    const { products, loading, error } = useSelector((state) => state.products)
    useEffect(() => {
        dispatch(fetchProducts())
    }, [dispatch])

    const handleAddToCart = (product) => {
        const confirmAdd = window.confirm(
            "Are you sure you want to add this product to your cart?"
        )

        if (confirmAdd) {
            dispatch(addToCart(product))
        }

    }

    // throw new Error("Test Error Boundary")

    return (
        <main>
            <h1 className="page-title">Products</h1>
            <div className="products-grid">
                {products.map(product => (
                    <div className="product-card" key={product.id}>
                        {product.image && <img src={`https://res.cloudinary.com/${CLOUD_NAME}/${product.image}`} alt={product.title} />}
                        <p>{product.id}. {product.title}</p>
                        <p>{product.description}</p>
                        <p className="price">Price : {product.price}</p>
                        <p>Location : {product.location}</p>
                        <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
                        <Link to={`/products/${product.id}`}>View Details</Link>
                    </div>
                ))}
            </div>
            {loading && <p className="state-message">Loading Products...</p>}
            {error && <p className="state-message error">{error}</p>}
        </main>
    )
}

export default Home