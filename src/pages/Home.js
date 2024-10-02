import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './Home.css'; // Import your custom CSS for additional styling

export default function Home() {
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
        });
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

            <Container  className="featured-products py-5">
                <h2 className="text-center">Sample Products</h2>
                <Row className="mt-4">
                    {products.length > 0 ? (
                        products.slice(0, 3).map(product => ( // Display only the first 3 products
                            <Col md={4} className="mb-4" key={product._id}>
                                <Card>
                                    <Card.Img variant="top" src={ "https://via.placeholder.com/300"} alt={product.name} />
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
