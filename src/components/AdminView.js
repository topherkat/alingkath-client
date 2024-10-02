import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import EditProduct from './EditProduct';  // Assuming you have EditProduct component
import ArchiveProduct from './ArchiveProduct';  // Assuming you have ArchiveProduct component
import 'bootstrap/dist/css/bootstrap.min.css';


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
                    {/* Show Category and Name */}
                    <td>{product.category}</td>
                    <td>{product.name}</td>
                    {/* Hide Description on small devices */}
                    <td className="d-none d-md-table-cell">{product.description}</td>
                    {/* Show Price */}
                    <td>{product.price}</td>
                    {/* Show Availability */}
                    <td className={product.isActive ? "text-success" : "text-danger"}>
                        {product.isActive ? "Available" : "Unavailable"}
                    </td>
                    {/* Show Edit and Archive Actions */}
                     <td>
                        <td>
                            <div className="d-flex flex-column flex-sm-row gap-2">
                                <EditProduct product={product} fetchData={fetchData} />
                                <ArchiveProduct product={product} isActive={product.isActive} fetchData={fetchData} />
                            </div>
                        </td>
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
                        <th className="d-none d-md-table-cell">Description</th>
                        <th>Price</th>
                        <th className="d-none d-md-table-cell">Availability</th>
                        <th colSpan="1">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products}
                </tbody>
            </Table>    
        </>
    );
}
