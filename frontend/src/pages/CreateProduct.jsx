import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createProduct } from '../features/products/productSlice'

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
        <>
            <div>CreateProduct</div>
            <form onSubmit={handleSubmit}>
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" />
                <input onChange={(e) => setDescription(e.target.value)} value={description} type="text" />
                <input onChange={(e) => setPrice(e.target.value)} value={price} type="number" />
                <input onChange={(e) => setLocation(e.target.value)} value={location} type="text" />
                <input onChange={(e) => setImage(e.target.files[0])} type="file" />

                <button disabled={loading}>Submit </button>
            </form>

        </>
    )
}

export default CreateProduct