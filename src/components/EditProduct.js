import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

export default function EditProduct({ product, fetchData }) {

    const notyf = new Notyf();

    // Initializing states based on the product prop
    const [productId, setProductId] = useState(product._id);
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [price, setPrice] = useState(product.price);
    const [category, setCategory] = useState(product.category);
    const [imageUrl, setImageUrl] = useState(product.imageUrl); // New field for image URL
    const [isActive, setIsActive] = useState(product.isActive);

    const [showEdit, setShowEdit] = useState(false);

    // Function to handle editing a product
    const editProduct = (e, productId) => {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_API_URL}/products/update/${productId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                name: name,
                description: description,
                price: price,
                category: category,
                imageUrl: imageUrl, // Include imageUrl in the update
                isActive: isActive
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                notyf.success("Product successfully updated!");
                closeEdit();
                fetchData(); // Refresh product list after editing
            } else {
                notyf.error("Error updating product.");
                closeEdit();
                fetchData();
            }
        });
    };

    // Show and hide modal functions
    const openEdit = () => {
        setShowEdit(true);
    };

    const closeEdit = () => {
        setShowEdit(false);
    };

    return (
        <>
            <Button variant="warning" size="sm" onClick={openEdit}>Edit</Button>

            {/* Edit Product Modal */}
            <Modal show={showEdit} onHide={closeEdit}>
                <Form onSubmit={event => editProduct(event, productId)}>

                    <Modal.Header closeButton>
                        <Modal.Title>Edit Product</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                        <Form.Group controlId="productCategory">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="productName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="productDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="productPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="productImageUrl">
                            <Form.Label>Image URL</Form.Label> {/* New Image URL field */}
                            <Form.Control
                                type="text"
                                placeholder="Enter Product Image URL"
                                value={imageUrl}
                                onChange={e => setImageUrl(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="productIsActive">
                            <Form.Check
                                type="checkbox"
                                label="Active"
                                checked={isActive}
                                onChange={e => setIsActive(e.target.checked)}
                            />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeEdit}>Close</Button>
                        <Button variant="success" type="submit">Submit</Button>
                    </Modal.Footer>

                </Form>
            </Modal>
        </>
    );
}
