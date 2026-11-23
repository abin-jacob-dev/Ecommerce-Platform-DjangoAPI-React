import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart } from '../features/cart/cartSlice'

function Cart() {
    const dispatch = useDispatch()
    const { items } = useSelector((state) => state.cart)
    const handleRemoveFromCart = (id) => {
        dispatch(removeFromCart(id))
    }
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
        </>
    )
}

export default Cart