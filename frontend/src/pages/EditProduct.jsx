import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchProductById, updateProduct } from '../features/products/productSlice'
import { useDispatch, useSelector } from 'react-redux'
import "./EditProduct.css";

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
        <main className="form-page">
            <div className="form-card">
                <h2 className="form-title">Update Product</h2>
                <form onSubmit={handleSubmit}>
                    {loading && <p className="form-hint">Loading...</p>}
                    {error && <p className="form-error">{error}</p>}
                    <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder="Title" required />
                    <input onChange={(e) => setDescription(e.target.value)} value={description} type="text" placeholder="Description" required />
                    <input onChange={(e) => setPrice(e.target.value)} value={price} type="number" placeholder="Price" required />
                    <input onChange={(e) => setLocation(e.target.value)} value={location} type="text" placeholder="Location" required />
                    <input onChange={(e) => setImage(e.target.files[0] || null)} type="file" />
                    <button disabled={loading}>Submit</button>
                </form>
            </div>
        </main>
    )
}

export default EditProduct