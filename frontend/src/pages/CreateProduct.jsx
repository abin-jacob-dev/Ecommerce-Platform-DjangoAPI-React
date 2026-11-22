import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createProduct } from '../features/products/productSlice'
import "./CreateProduct.css";

function CreateProduct() {
    const { accessToken } = useSelector((state) => state.auth)
    const { loading, error } = useSelector((state) => state.products)
    const dispatch = useDispatch()
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

        dispatch(createProduct({ productData, accessToken }))
    }
    return (
        <main className="form-page">
            <div className="form-card">
                <h2 className="form-title">Create Product</h2>
                <form onSubmit={handleSubmit}>
                    {loading && <p className="form-hint">Loading...</p>}
                    {error && <p className="form-error">{error}</p>}
                    <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder="Title" required />
                    <input onChange={(e) => setDescription(e.target.value)} value={description} type="text" placeholder="Description" required />
                    <input onChange={(e) => setPrice(e.target.value)} value={price} type="number" placeholder="Price" required />
                    <input onChange={(e) => setLocation(e.target.value)} value={location} type="text" placeholder="Location" required />
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" />
                    <button disabled={loading}>Submit</button>
                </form>
            </div>
        </main>
    )
}

export default CreateProduct