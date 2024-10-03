import { useState, useEffect } from 'react';
import { Table, Dropdown, Button } from 'react-bootstrap';
import EditProduct from './EditProduct';  // Assuming you have EditProduct component
import ArchiveProduct from './ArchiveProduct';  // Assuming you have ArchiveProduct component
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AdminView({ productsData, fetchData }) {
    const [products, setProducts] = useState([]);
    const [sortKey, setSortKey] = useState('category'); // Default sort by category
    const [sortOrder, setSortOrder] = useState('asc'); // Default sort order

    // Function to sort products based on the selected key and order
    const sortProducts = (key, order) => {
        const sortedProducts = [...productsData].sort((a, b) => {
            const valueA = a[key].toString().toLowerCase(); // Convert to string for comparison
            const valueB = b[key].toString().toLowerCase();

            if (order === 'asc') {
                return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
            } else {
                return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
            }
        });

        setProducts(sortedProducts);
    };

    // Getting the productsData from the products page
    useEffect(() => {
        sortProducts(sortKey, sortOrder); // Sort products whenever productsData changes
    }, [productsData, sortKey, sortOrder]);

    // Handle sort key change
    const handleSortChange = (key) => {
        if (key === sortKey) {
            // If the same key is clicked, toggle the order
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // Set new key and reset order to ascending
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    return (
        <>
            <h1 className="text-center my-4">Admin Dashboard</h1>

            
            <div className="mb-3 d-flex gap-2 justify-content-center">

                <a href="/add-product"><Button variant="secondary">Add Course</Button></a>

                <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                        Sort by: {sortKey.charAt(0).toUpperCase() + sortKey.slice(1)} ({sortOrder})
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleSortChange('category')}>
                            Category
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSortChange('name')}>
                            Name
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSortChange('price')}>
                            Price
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSortChange('isActive')}>
                            Availability
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <Table striped bordered hover responsive className="mb-5 w-100">
                <thead>
                    <tr className="text-center">
                        <th className="d-none d-md-table-cell">Category</th>
                        <th>Name</th>
                        <th className="d-none d-md-table-cell">Description</th>
                        <th>Price</th>
                        
                        <th colSpan="1">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                            <td className="d-none d-md-table-cell">{product.category}</td>
                            <td>{product.name}</td>
                            <td className="d-none d-md-table-cell">{product.description}</td>
                            <td>{product.price}</td>
                           
                            <td>
                                <div className="d-flex flex-column flex-sm-row gap-2">
                                    <EditProduct product={product} fetchData={fetchData} />
                                    <ArchiveProduct product={product} isActive={product.isActive} fetchData={fetchData} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}
