import { useState, useEffect } from 'react';
import { Table, Dropdown, Button, Pagination } from 'react-bootstrap';
import EditProduct from './EditProduct'; // Assuming you have EditProduct component
import ArchiveProduct from './ArchiveProduct';
import { Notyf } from 'notyf';
import Swal from 'sweetalert2';


export default function AdminView({ productsData, fetchData }) {
    const notyf = new Notyf();
    const [products, setProducts] = useState([]);
    const [sortKey, setSortKey] = useState('category'); // Default sort by category
    const [sortOrder, setSortOrder] = useState('asc'); // Default sort order
    const [productName, setProductName] = useState("");

    const [currentPage, setCurrentPage] = useState(1); // Current page
    const productsPerPage = 20; // Products per page

    // Function to sort products based on the selected key and order
    const sortProducts = (key, order) => {
        const sortedProducts = [...productsData].sort((a, b) => {
            const valueA = a[key].toString().toLowerCase();
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

    // Handle product search
    function searchProduct(e) {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_URL}/products/search-products`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: productName })
        })
            .then(res => res.json())
            .then(data => {
                if (data.message === "No products found with the given name.") {
                    notyf.error("No products found with the given name.");
                } else {
                    setProducts(data);
                }
            })
            .catch(() => {
                notyf.error("Error fetching products");
            });
    }

    // Delete product
    const deleteProduct = (id) => {

        Swal.fire({
          title: "Are you sure you want to delete this product?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
              
               fetch(`${process.env.REACT_APP_API_URL}/products/${id}`, {
                   method: 'DELETE',
                   headers: {
                       'Content-Type': 'application/json',
                       Authorization: `Bearer ${localStorage.getItem('token')}`
                   }
               })
               .then(res => res.json())
               .then(data => {

                   console.log(data);

                   if(data.message = "Product deleted successfully"){
                       Swal.fire({
                         title: `${data.message}`,
                         text: ``,
                         showConfirmButton: false,
                         icon: "success"
                       });
                   }
                  
               })
               .catch((error) => {
                   console.log(error)
                   notyf.error('Error deleting product');
               });
            }
          
        });


        
    };

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <h1 className="text-center my-4">Admin Dashboard</h1>

            {/* Search Form */}
            <form onSubmit={searchProduct} className="my-4">
                <div className="form-group d-flex gap-2 col-12 col-md-10 m-auto">
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

            {/* Sort Dropdown */}
            <div className="mb-3 me-2 d-flex gap-2 justify-content-end">
                <a href="/add-product"><Button variant="dark">+ Product</Button></a>
                <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                        Sort by: {sortKey.charAt(0).toUpperCase() + sortKey.slice(1)} ({sortOrder})
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleSortChange('category')}>Category</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSortChange('name')}>Name</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSortChange('price')}>Price</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSortChange('isActive')}>Availability</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {/* Products Table */}
            <Table striped bordered hover responsive className="mb-5 w-100">
                <thead>
                    <tr className="text-center">
                        <th className="d-none d-md-table-cell">Category</th>
                        <th>Name</th>
                        <th className="d-none d-md-table-cell">Description</th>
                        <th>Price</th>
                        <th colSpan="1">Info</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map(product => (
                        <tr key={product._id}>
                            <td className="d-none d-md-table-cell">{product.category}</td>
                            <td>{product.name}</td>
                            <td className="d-none d-md-table-cell">{product.description}</td>
                            <td>{product.price}</td>
                            <td>
                                <div className="d-flex flex-column flex-sm-row gap-2">
                                    <EditProduct product={product} fetchData={fetchData} />
                                    <ArchiveProduct product={product} isActive={product.isActive} fetchData={fetchData} />
                                    <Button
                                        variant="light"
                                        onClick={() => deleteProduct(product._id)}
                                    >
                                        🗑️
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Pagination */}
            <Pagination className="d-flex justify-content-center mb-5">
                {[...Array(totalPages).keys()].map(pageNumber => (
                    <Pagination.Item
                        key={pageNumber + 1}
                        active={currentPage === pageNumber + 1}
                        onClick={() => paginate(pageNumber + 1)}
                    >
                        {pageNumber + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </>
    );
}
