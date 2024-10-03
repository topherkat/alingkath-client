import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Notyf } from 'notyf'; // imports the notyf module

import './Home.css'; // Import your custom CSS for additional styling

export default function Home() {
    const notyf = new Notyf();
    const [products, setProducts] = useState([]); // State to hold fetched products

    const fetchData = () => {
        const fetchUrl = `${process.env.REACT_APP_API_URL}/products`;

        // Fetch products from the server
        fetch(fetchUrl, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}` // Include token in headers
            }
        })
        .then(res => res.json())
        .then(data => {
            setProducts(data); // Update products state with fetched data
        })
        .catch(error => {
            console.error("Error fetching products:", error); // Handle errors

            if (error.toString().includes("TypeError: Failed to fetch")) {
              notyf.error("Data not yet available. Please wait."); // Handle errors
            
            }
            
        });

    };

    // Shuffle array function
    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    // Fetch products when the component mounts
    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array to fetch data only once on mount

    return (
        <Container fluid className="home-container">
            <header className="text-center py-5">
                <h1 id="brand">Aling Kath's</h1>
                <p>Purok 7, Latag, Sari-sari Store</p>
                <Button variant="success" href="/products">Shop Now</Button>
            </header>

            <Container className="featured-products py-5">
                <h2 className="text-center">Sample Products</h2>
                <Row className="mt-4">
                    {products.length > 0 ? (
                        shuffleArray(products).slice(0, 4).map(product => ( // Shuffle and display random 3 products
                            <Col md={3} className="mb-4" key={product._id}>
                                <Card>
                                    {/* Add inline styles to make the image uniform */}
                                    <Card.Img 
                                        variant="top" 
                                        src={product.imageUrl} 
                                        alt={product.name} 
                                        className="w-100"
                                        style={{ 
                                            height: "200px", 
                                            objectFit: "cover" 
                                        }} 
                                    />
                                    <Card.Body>
                                        <Card.Title>{product.name}</Card.Title>
                                        <Card.Text>
                                            {product.description}
                                        </Card.Text>
                                        <Card.Text>
                                            Price: ${product.price}
                                        </Card.Text>
                                        {/* Uncomment the button if you want to link to the product details page */}
                                        {/*<Button variant="primary" href={`/products/${product._id}`}>View Product</Button>*/}
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col>
                            <h4 className="text-center">No products available at the moment.</h4>
                        </Col>
                    )}
                </Row>
            </Container>

            <footer className="text-center py-5">
                <p>© 2024 Aling Kath Store. All rights reserved.</p>
            </footer>
        </Container>
    );
}
