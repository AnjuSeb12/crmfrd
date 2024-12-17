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
                <input type="text" placeholder='Name' value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <input type="text" placeholder='Description' value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                <input type="number" placeholder='Price' value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                    <label htmlFor="warranty">Warranty&nbsp;</label>
                <input type="checkbox" checked={formData.warranty}
                    onChange={(e) => setFormData({ ...formData, warranty: e.target.checked })}/>
                <input type="text" placeholder='Brand' value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
                <button type="submit">
                    {editProduct ? 'Update' : 'Add'} Product
                </button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Warranty</th>
                        <th>Brand</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>


                    { products && products.map((product) => (
                        <tr key={product._id} >
                            <td className='text-black' >{product.name}</td><br/>
                            <td >{product.description}</td><br/>
                            <td >{product.price}</td><br/>
                            <td >{product.warranty ? 'Yes' : 'No'}</td><br/>
                            <td >{product.brand}</td>
                            <td>
                                <button
                                    onClick={() => handleEdit(product)}

                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(product._id)}

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