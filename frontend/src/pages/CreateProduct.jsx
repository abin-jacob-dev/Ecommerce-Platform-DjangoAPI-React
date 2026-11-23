import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createProduct } from '../features/products/productSlice'
import "./CreateProduct.css";
import { useForm } from "react-hook-form";

function CreateProduct() {
    const { register, handleSubmit, formState } = useForm()
    const { errors } = formState
    const { accessToken } = useSelector((state) => state.auth)
    const { loading, error } = useSelector((state) => state.products)
    const dispatch = useDispatch()

    const onSubmit = (data) => {
        const productData = {
            ...data,
            image: data.image[0] || null
        }

        dispatch(createProduct({ productData, accessToken }))
    }
    return (
        <main className="form-page">
            <div className="form-card">
                <h2 className="form-title">Create Product</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {loading && <p className="form-hint">Loading...</p>}
                    {error && <p className="form-error">{error}</p>}
                    <input  {...register('title', { required: { value: true, message: "Title is required" } })} type="text" placeholder="Title"  />
                    {errors.title && <p>{errors.title.message}</p>}
                    <input {...register('description', {
                        required: {
                            value: true,
                            message: "Description is required"
                        },
                        minLength: {
                            value: 10,
                            message: "Description must be at least 10 characters"
                        }
                    })} type="text" placeholder="Description" />
                    {errors.description && <p>{errors.description.message}</p>}
                    <input {...register('price', { required: "Price is required", min: { value: 1, message: "Price must be greater than zero" } })} type="number" placeholder="Price"  />
                    {errors.price && <p>{errors.price.message}</p>}
                    <input {...register('location', { required: "Location is required" })} type="text" placeholder="Location"  />
                    {errors.location && <p>{errors.location.message}</p>}
                    <input {...register('image')} type="file" />
                    <button disabled={loading}>Submit</button>
                </form>
            </div>
        </main>
    )
}

export default CreateProduct