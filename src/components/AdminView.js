import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import EditProduct from './EditProduct';  // Assuming you have EditProduct component
import ArchiveProduct from './ArchiveProduct';  // Assuming you have ArchiveProduct component

export default function AdminView({ productsData, fetchData }) {

    const [products, setProducts] = useState([]);

    // Getting the productsData from the products page
    useEffect(() => {
        // Sort productsData by category before mapping
        const sortedProducts = [...productsData].sort((a, b) => {
            if (a.category < b.category) return -1;
            if (a.category > b.category) return 1;
            return 0;
        });

        const productsArr = sortedProducts.map(product => {
            return (
                <tr key={product._id}>
                    <td>{product.category}</td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.price}</td>
                    <td className={product.isActive ? "text-success" : "text-danger"}>
                        {product.isActive ? "Available" : "Unavailable"}
                    </td>
                    <td> 
                        <EditProduct product={product} fetchData={fetchData} /> 
                    </td>
                    <td>  
                        <ArchiveProduct product={product} isActive={product.isActive} fetchData={fetchData} /> 
                    </td>
                </tr>
            );
        });

        setProducts(productsArr);
    }, [productsData]);

    return (
        <>
            <h1 className="text-center my-4">Admin Dashboard</h1>
            
            <Table striped bordered hover responsive>
                <thead>
                    <tr className="text-center">
                        <th>Category</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Availability</th>
                        <th colSpan="2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products}
                </tbody>
            </Table>    
        </>
    );
}
