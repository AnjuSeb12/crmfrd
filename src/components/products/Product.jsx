import React, { useEffect, useState } from 'react'


import "./Product.css"
import axios from 'axios'

const Product = () => {
    const [products, setProducts] = useState([])

    const [page, setPage] = useState(1);
    const [limit,setLimit]=useState(3)
    const [totalPages, setTotalPages] = useState(4);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        warranty: false,
        brand: ""
    });
    const [editProduct, setEditProduct] = useState(null);
    const [search, setSearch] = useState("")
    const [filterWarranty, setFilterWarranty] = useState(false)

    const fetchProducts = async () => {

        try {
            console.log("hitted")
            const response = await axios.get('http://localhost:5000/api/v1/product/getproduct')
            console.log("products", response.data)
            setProducts(response.data.products)
            

        } catch (error) {
            console.log('Error:', error)

        }
    }


    useEffect(() => {

        fetchProducts();
    }, [])

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/v1/product/deleteproduct/${id}`)
        fetchProducts();
    }

    // const handleChangeWarranty=(e)=>{
    //     setFilterWarranty(e.target.value)
    //     handleSearch(e.target.value)

    // }
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
            await axios.put(`http://localhost:5000/api/v1/product/updateproduct/${editProduct._id}`, formData, {

            });
        } else {
            await axios.post('http://localhost:5000/api/v1/product/addproduct', formData);
        }
        fetchProducts();
        setFormData({ name: '', description: '', price: '', warranty: false, brand: '' });
        setEditProduct(null);
    };
    // const handleSearch =async (warranty) => {
    //     // const res=await axios.get(`http://localhost:5000/api/v1/product/search?searchTerm=${search}`)
    //     const res = await axios.get(`http://localhost:5000/api/v1/product/search?searchTerm=${search}&warranty=${warranty}`);

    //     if(res.status===200){
    //         setProducts(res.data?.products)

    //     }



    // }
    const handleSearch = async (warranty) => {

        if (search.length > 0 || warranty) {
            const res = await axios.get(`http://localhost:5000/api/v1/product/search?searchTerm=${search}&warranty=${warranty}&limit=${limit}&page=${page}`);
            if (res.status == 200) {

                setProducts(res.data?.products)
            }

        } else {
            const res = await axios.get('http://localhost:5000/api/v1/product/getproduct')
            setProducts(res.data.products)
        }




    }


    useEffect(() => {
        if (search.length > 0) {
            handleSearch(filterWarranty)
        }



    }, [search,page])

    
   


    return (
        <div>
            <h1>Product Management</h1>
            <div>
                <input type="text" placeholder='search...' value={search} onChange={(e) => setSearch(e.target.value)} />
                <label>
                    {/* <input type="checkbox" name="" id="" placeholder="warrenty" value={filterWarranty} onChange={(e) =>{setFilterWarranty(prev=>!prev);console.log(e.target.value);handleSearch(!filterWarranty);
                } } /> */}
                    <input type="checkbox" name="" id="" placeholder="warrenty" checked={filterWarranty} onChange={(e) => {
                        const newvalue = !filterWarranty;
                        setFilterWarranty(newvalue)
                        handleSearch(newvalue)
                    }}
                    />
                    Warranty Only
                </label>
            </div>
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
                    onChange={(e) => setFormData({ ...formData, warranty: e.target.checked })} />
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


                    {products && products.map((product) => (
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
            {/* test */}


             <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button> 

            {/* test */}


        </div >
    )
}

export default Product