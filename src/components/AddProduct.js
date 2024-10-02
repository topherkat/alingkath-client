import { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';

export default function AddProduct() {
    const notyf = new Notyf();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    // Input states
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState(""); // New field for category
    const [isActive, setIsActive] = useState(true); // Field for isActive

    function createProduct(e) {
        // Prevent the default form submission
        e.preventDefault();

        let token = localStorage.getItem('token');
        console.log(token);

        fetch(`${process.env.REACT_APP_API_URL}/products/add`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: name,
                description: description,
                price: parseFloat(price), // Ensure price is a number
                category: category, // Include the category
                isActive: isActive // Include isActive
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data); // Log response data

                if (data.message === "Product already exists") {
                    notyf.error("Error: Product already exists.");
                } else if (data.success === true) {
                    // Clear input fields after successful submission
                    setName("");
                    setDescription("");
                    setPrice("");
                    setCategory(""); // Reset category
                    setIsActive(true); // Reset isActive to default value

                    notyf.success("Product Creation Successful");
                    navigate("/products"); // Navigate to the products page
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
                <h1 className="my-5 text-center">Add Product</h1>
                <Form onSubmit={e => createProduct(e)}>

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
                        <Form.Check
                            type="checkbox"
                            label="Is Active"
                            checked={isActive}
                            onChange={e => setIsActive(e.target.checked)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="my-5">Submit</Button>
                </Form>
            </>
        )
    );
}
