import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchProductById, updateProduct } from '../features/products/productSlice'
import { useDispatch, useSelector } from 'react-redux'
import "./EditProduct.css";
import { useForm } from 'react-hook-form';

function EditProduct() {
    const { formState, register, handleSubmit, reset } = useForm()
    const { errors } = formState
    const { id } = useParams()
    const { product, loading, error } = useSelector((state) => state.products)
    const { accessToken } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchProductById(id))
    }, [dispatch, id])
    useEffect(() => {
        if (product && String(product.id) === id) {

            reset({
                title: product.title || "",
                description: product.description || "",
                price: product.price || "",
                location: product.location || ""
            })
        }


    }, [product, id, reset])

    const onSubmit = (data) => {
        const productData = {
            title: data.title,
            description: data.description,
            price: data.price,
            location: data.location
        }
        if (data.image?.[0]) {
            productData.image = data.image[0]
        }

        dispatch(updateProduct({ id, productData, accessToken }))
    }
    return (
        <main className="form-page">
            <div className="form-card">
                <h2 className="form-title">Update Product</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {loading && <p className="form-hint">Loading...</p>}
                    {error && <p className="form-error">{error}</p>}
                    <input  {...register('title', { required: { value: true, message: "Title is required" }, minLength: { value: 3, message: "Minimum Length is 3 characters" } })} type="text" placeholder="Title" />
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
                    <input {...register('price', { required: "Price is required", min: { value: 1, message: "Price must be greater than zero" } })} type="number" placeholder="Price" />
                    {errors.price && <p>{errors.price.message}</p>}
                    <input {...register('location', { required: "Location is required" })} type="text" placeholder="Location" />
                    {errors.location && <p>{errors.location.message}</p>}
                    <input {...register('image')} type="file" />
                    <button disabled={loading}>Submit</button>
                </form>
            </div>
        </main>
    )
}

export default EditProduct