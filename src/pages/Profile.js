import { useState, useEffect } from 'react';
import { Card, Spinner, Button, Modal, Form } from 'react-bootstrap';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formValues, setFormValues] = useState({
        firstname: '',
        lastname: '',
        email: '',
        contactNumber: '',
        address: '',
        facebookLink: ''
    });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token'); // Assuming token is stored in local storage after login

            const res = await fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Sending token in the Authorization header
                    'Content-Type': 'application/json'
                }
            });

            if (res.status === 404) {
                throw new Error('Invalid signature');
            }

            if (!res.ok) {
                throw new Error('Failed to fetch profile');
            }

            const data = await res.json();
            setUser(data);
            setFormValues({
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                contactNumber: data.contactNumber,
                address: data.address,
                facebookLink: data.facebookLink || ''
            });
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleEditClick = () => {
        setShowModal(true); // Show the modal when edit is clicked
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.REACT_APP_API_URL}/users/edit`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formValues)
            });

            if (!res.ok) {
                throw new Error('Failed to update profile');
            }

            const updatedUser = await res.json();
            setUser(updatedUser);
            setShowModal(false); // Close the modal after successful update
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <Spinner animation="border" role="status" className="d-block mx-auto mt-5">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    }

    if (error) {
        return <div className="text-center mt-5 text-danger">Error: {error}</div>;
    }

    return (
        <div className="container mt-5">
            {user ? (
                <>
                    <Card className="mx-auto" style={{ maxWidth: '400px' }}>
                        <Card.Body>
                            <Card.Title className="text-center">User Profile</Card.Title>
                            <Card.Text>
                                <strong>Name:</strong> {user.firstname} {user.lastname} <br />
                                <strong>Email:</strong> {user.email} <br />
                                <strong>Contact Number:</strong> {user.contactNumber} <br />
                                <strong>Address:</strong> {user.address} <br />
                                {user.facebookLink && (
                                    <>
                                        <strong>Facebook:</strong> <a href={user.facebookLink} target="_blank" rel="noopener noreferrer">{user.facebookLink}</a><br />
                                    </>
                                )}
                                <strong>Admin Status:</strong> {user.isAdmin ? "Admin" : "User"} <br />
                            </Card.Text>
                            <Button variant="primary" className="w-100" onClick={handleEditClick}>
                                Edit Profile
                            </Button>
                        </Card.Body>
                    </Card>

                    {/* Edit Profile Modal */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Profile</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstname"
                                        value={formValues.firstname}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastname"
                                        value={formValues.lastname}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formValues.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Contact Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contactNumber"
                                        value={formValues.contactNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={formValues.address}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Facebook Link</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="facebookLink"
                                        value={formValues.facebookLink}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100">
                                    Save Changes
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </>
            ) : (
                <div className="text-center text-muted">User not found</div>
            )}
        </div>
    );
}
