import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, createCheckout } from '../features/cart/cartSlice'
import "./Cart.css";

const CLOUD_NAME = "campeon-ecommerce";

function Cart() {
    const dispatch = useDispatch()
    const { accessToken } = useSelector((state) => state.auth)
    const { items, checkoutLoading, checkoutSuccess, checkoutError } = useSelector((state) => state.cart)
    const handleRemoveFromCart = (id) => {
        dispatch(removeFromCart(id))
    }
    const handleCheckout = (product_ids) => {
        dispatch(createCheckout({ product_ids, accessToken }))
    }
    const product_ids = items.map(item => item.id)
    return (
        <main className="cart-page">
            <h1 className="cart-title">Cart</h1>
            <div className="cart-list">
                {items.map(item => (
                    <div className="cart-item" key={item.id}>
                        {item.image && (
                            <img
                                className="item-image"
                                src={`https://res.cloudinary.com/${CLOUD_NAME}/${item.image}`}
                                alt={item.title}
                            />
                        )}
                        <div className="item-info">
                            <p>{item.id}. {item.title}</p>
                            <p>{item.description}</p>
                            <p className="item-price">{item.price}</p>
                            <button className="btn-danger" onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="cart-actions">
                <button disabled={items.length === 0 || checkoutLoading} onClick={() => handleCheckout(product_ids)}> {checkoutLoading ? 'Processing...' : 'Checkout'}</button>
                {checkoutSuccess && <p>Checkout Successful</p>}
                {checkoutError && <p>{checkoutError}</p>}
            </div>
        </main>
    )
}

export default Cart