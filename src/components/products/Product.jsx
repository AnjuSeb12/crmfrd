import React, { useEffect, useState } from 'react'


import "./Product.css"
import axios from 'axios'

const Product = () => {
    const [products, setProducts] = useState([])
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        warranty: false,
        brand: ""
    });
    const [editProduct, setEditProduct] = useState(null);
    
    const fetchProducts= async ()=>{
        try {
            console.log("hitted")
            const response=await axios.get('http://localhost:5000/api/v1/product/getproduct')
            console.log("products",response.data)
            setProducts(response.data)
            
        } catch (error) {
            console.log('Error:',error)
            
        }
    }

    
    useEffect(() => {
        
        fetchProducts();
    }, [])

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/v1/product/deleteproduct/${id}`)
        fetchProducts();
    }
    const handleEdit = (product) => {
        setEditProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            warranty: product.warranty,
            brand: product.brand
        });

    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editProduct) {
            await axios.put(`http://localhost:5000/api/v1/product/updateproduct/${editProduct._id}`, formData,{
                
            });
        } else {
            await axios.post('http://localhost:5000/api/v1/product/addproduct', formData);
        }
        fetchProducts();
        setFormData({ name: '', description: '', price: '', warranty: false, brand: '' });
        setEditProduct(null);
    };



    return (
        <div>
            <h1>Product Management</h1>
            <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:&nbsp;</label>
                <input type="text" placeholder='Name' value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    <label htmlFor="description">Description:&nbsp;</label>
                <input type="text" placeholder='Description' value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    <label htmlFor="price">Price:&nbsp;</label>
                <input type="number" placeholder='Price' value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                    <label htmlFor="warranty">Warranty&nbsp;</label>
                <input type="checkbox" checked={formData.warranty}
                    onChange={(e) => setFormData({ ...formData, warranty: e.target.checked })}/>
                    <label htmlFor="brand">Brand:&nbsp;</label>
                <input type="text" placeholder='Brand' value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
                <button type="submit">
                    {editProduct ? 'Update' : 'Add'} Product
                </button>
            </form>

            <table className='table-auto border-collapse border border-gray-300 w-full'>
                <thead>
                    <tr>
                        <th className='border border-gray-300 px-4 py-2 text-left'>Name</th>
                        <th className='border border-gray-300 px-4 py-2 text-left'>Description</th>
                        <th className='border border-gray-300 px-4 py-2 text-left'>Price</th>
                        <th className='border border-gray-300 px-4 py-2 text-left'>Warranty</th>
                        <th className='border border-gray-300 px-4 py-2 text-left'>Brand</th>
                        <th className='border border-gray-300 px-4 py-2 text-left'>Edit</th>
                        <th className='border border-gray-300 px-4 py-2 text-left'>Delete</th>
                    </tr>
                </thead>
                <tbody>


                    { products && products.map((product) => (
                        <tr key={product._id} >
                            <td className='border border-gray-300 px-4 py-2' >{product.name}</td>
                            <td className='border border-gray-300 px-4 py-2'>{product.description}</td>
                            <td className='border border-gray-300 px-4 py-2'>{product.price}</td>
                            <td className='border border-gray-300 px-4 py-2'>{product.warranty ? 'Yes' : 'No'}</td>
                            <td className='border border-gray-300 px-4 py-2'>{product.brand}</td>
                            <td className='border border-gray-300 px-4 py-2'>
                                <button
                                    onClick={() => handleEdit(product)}
                                    className=' px-8 py-2 bg-blue-700 text-white rounded'

                                >
                                    Edit
                                </button></td><td className='border border-gray-300 px-4 py-2'>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className='border border-gray-300 px-4 py-2 bg-blue-700 text-white rounded'

                                    

                                >
                                    Delete
                                </button>
                            </td>
                        </tr>


                    ))}
                </tbody>
            </table>


        </div >
    )
}

export default Product