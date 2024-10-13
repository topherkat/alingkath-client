import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner, Container, Alert } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function ManageFeedbacks() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    // Fetch all feedbacks from the API
    const fetchFeedbacks = async () => {
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/feedback`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();
           
            setFeedbacks(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Handle feedback deletion
    const handleDelete = async (feedbackId) => {
        const token = localStorage.getItem('token');

        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this feedback?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`${process.env.REACT_APP_API_URL}/feedback/${feedbackId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.message || "Failed to delete feedback.");
                    }

                    Swal.fire("Deleted!", "Feedback has been deleted.", "success");

                    // Remove the deleted feedback from the state
                    setFeedbacks(feedbacks.filter(feedback => feedback._id !== feedbackId));
                } catch (err) {
                    Swal.fire("Error", err.message, "error");
                }
            }
        });
    };

    if (loading) {
        return (
            <Spinner animation="border" role="status" className="d-block mx-auto mt-5">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    }

    if (error) {
        return <Alert variant="danger" className="text-center mt-5">Error: {error}</Alert>;
    }

    return (
        <Container className="mt-5">
            <h2 className="text-center">Manage Feedbacks</h2>
            {feedbacks.length > 0 ? (
                <Table striped bordered hover className="mt-4">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Feedback</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map(feedback => (
                            <tr key={feedback._id}>
                                <td>{feedback._id}</td>
                                <td>{feedback.comment}</td>
                                <td>
                                    <Button variant="danger" onClick={() => handleDelete(feedback._id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <Alert variant="info" className="text-center mt-5">No feedbacks found.</Alert>
            )}
        </Container>
    );
}
