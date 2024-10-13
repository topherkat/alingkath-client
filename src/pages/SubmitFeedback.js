import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function SubmitFeedback() {
    const [feedback, setFeedback] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        if (!feedback) {
            setError("Please enter your feedback.");
            return;
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/feedback/submit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ comment: feedback })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to submit feedback.");
            }

            setSuccess(true);
            setFeedback(""); // Clear the feedback field
            Swal.fire("Success", "Your feedback has been submitted!", "success");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Container className="mt-5">
            <Card className="mx-auto" style={{ maxWidth: '500px' }}>
                <Card.Body>
                    <Card.Title className="text-center">Submit Your Feedback</Card.Title>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">Feedback submitted successfully!</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="feedbackForm.ControlTextarea">
                            <Form.Label>Your Feedback</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Enter your feedback here"
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3 w-100">
                            Submit Feedback
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
