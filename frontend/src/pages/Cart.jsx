import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, createCheckout } from '../features/cart/cartSlice'


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
        <>
            <div>Cart</div>
            {items.map(item => (
                <div key={item.id}>
                    <p>{item.title}</p>
                    <p>{item.price}</p>
                    <button onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
                </div>
            ))}

            <button disabled={items.length === 0 || checkoutLoading} onClick={() => handleCheckout(product_ids)}> {checkoutLoading ? 'Processing...' : 'Checkout'}</button>
            {checkoutSuccess && <p>Checkout Successful</p>}
            {checkoutError && <p>{checkoutError}</p>}
        </>
    )
}

export default Cart