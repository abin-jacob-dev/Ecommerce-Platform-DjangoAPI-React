import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchProductById, updateProduct } from '../features/products/productSlice'
import { useDispatch, useSelector } from 'react-redux'

function EditProduct() {
    const { id } = useParams()
    const { product, loading, error } = useSelector((state) => state.products)
    const { accessToken } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchProductById(id))
    }, [dispatch, id])
    useEffect(() => {
        if (product && String(product.id) === id) {
            setTitle(product.title || "")
            setDescription(product.description || "")
            setPrice(product.price || "")
            setLocation(product.location || "")
        }


    }, [product, id])


    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [location, setLocation] = useState("")
    const [image, setImage] = useState(null)
    const productData = {
        title, description, price, location, image
    }
    const handleSubmit = (e) => {
        e.preventDefault()

        dispatch(updateProduct({ id, productData, accessToken }))
    }
    return (
        <>
            <div>Update Product </div>
            <form onSubmit={handleSubmit}>
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" />
                <input onChange={(e) => setDescription(e.target.value)} value={description} type="text" />
                <input onChange={(e) => setPrice(e.target.value)} value={price} type="number" />
                <input onChange={(e) => setLocation(e.target.value)} value={location} type="text" />
                <input onChange={(e) => setImage(e.target.files[0] || null)} type="file" />

                <button disabled={loading}>Submit </button>
            </form>

        </>
    )
}

export default EditProduct