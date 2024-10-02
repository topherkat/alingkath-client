import { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import {Container} from 'react-bootstrap';

export default function AddProduct() {
    const notyf = new Notyf();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    // Input states
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [imageUrl, setImageUrl] = useState(""); // New field for image URL
    const [isActive, setIsActive] = useState(true);

    function createProduct(e) {
        e.preventDefault();

        let token = localStorage.getItem('token');

        fetch(`${process.env.REACT_APP_API_URL}/products/add`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: name,
                description: description,
                price: parseFloat(price), 
                category: category, 
                imageUrl: imageUrl, // Include the image URL
                isActive: isActive 
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Product already exists") {
                notyf.error("Error: Product already exists.");
            } else if (data.success === true) {
                // Clear input fields after successful submission
                setName("");
                setDescription("");
                setPrice("");
                setCategory("");
                setImageUrl(""); // Reset image URL
                setIsActive(true);

                notyf.success("Product Creation Successful");
                navigate("/products");
            } else {
                notyf.error("Error: Something Went Wrong.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            notyf.error("Error: Something Went Wrong.");
        });
    }

    return (
        user.isAdmin === false ? (
            <Navigate to="/products" />
        ) : (
            <>  
            <Container>
                <h1 className="my-5 text-center">Add Product</h1>
                <Form onSubmit={createProduct}>
                    <Form.Group>
                        <Form.Label>Category:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Product Category"
                            required
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Name:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Product Name"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Description:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Product Description"
                            required
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Price:</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter Product Price"
                            required
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Image URL:</Form.Label> {/* New Image URL field */}
                        <Form.Control
                            type="text"
                            placeholder="Enter Product Image URL"
                            value={imageUrl}
                            onChange={e => setImageUrl(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Check
                            type="checkbox"
                            label="Is Active"
                            checked={isActive}
                            onChange={e => setIsActive(e.target.checked)}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="my-5">Submit</Button>
                </Form>
            </Container>
            </>
        )
    );
}
