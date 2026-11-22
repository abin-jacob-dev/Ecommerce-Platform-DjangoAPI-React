import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchProductById } from '../features/products/productSlice'

const CLOUD_NAME = "campeon-ecommerce";

function ProductDetails() {
    const { product, loading, error } = useSelector((state) => state.products)
    const { id } = useParams()
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchProductById(id))
    }, [id, dispatch])

    return (
        <>
            <div>ProductDetails</div>
            <hr />
            {loading && <p>Loading Product...</p>}
            {error && <p>{error}</p>}
            {product && <div>
                <p>{product.title}</p>
                <p>{product.description}</p>
                <p>{product.price}</p>
                <p>{product.location}</p>
                {product.image && <img width="150" src={`https://res.cloudinary.com/${CLOUD_NAME}/${product.image}`} alt={product.title} />}
            </div>
            }
        </>
    )
}

export default ProductDetails