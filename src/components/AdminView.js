import { useState, useEffect } from 'react';
import { Table, Dropdown, Button } from 'react-bootstrap';
import EditProduct from './EditProduct';  // Assuming you have EditProduct component
import ArchiveProduct from './ArchiveProduct'; 

import { Notyf } from 'notyf'; 


export default function AdminView({ productsData, fetchData }) {
        const notyf = new Notyf(); // <---
    

    const [products, setProducts] = useState([]);
    const [sortKey, setSortKey] = useState('category'); // Default sort by category
    const [sortOrder, setSortOrder] = useState('asc'); // Default sort order
    const [productName,setProductName] = useState("");

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




    function searchProduct(e) {

        // Prevents page redirection via form submission
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_URL}/products/search-products`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                name: productName

            })
        })
        .then(res => res.json())
        .then(data => {

            setProducts(data);
        })
        .catch(error =>{

            notyf.error(error);
            if (error.toString().includes("TypeError: Failed to fetch")) {
              notyf.error("Data not yet available. Please wait."); // Handle errors
            
            }
        })

    }


    return (
        <>



           

            <h1 className="text-center my-4">Admin Dashboard</h1>


            <form onSubmit={searchProduct} className="my-4">
                <div className="form-group d-flex gap-2 col-12 col-md-10 m-auto ">
                 
                  <input
                    type="text"
                    className="form-control"
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}   
                    placeholder="Input to search a product"
                  />

                   <button type="submit" className="btn btn-success h-100">Search</button>
                </div>
               
              </form>

               <div className=" mb-3 me-2 d-flex gap-2 justify-content-end">
                <a href="/add-product"><Button variant="dark">+ Product</Button></a>
                <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic">
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
