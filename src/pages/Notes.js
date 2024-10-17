import { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Row, Col, Card } from 'react-bootstrap';

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [editNoteId, setEditNoteId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Fetch all notes
    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/notes`);
            const data = await res.json();
            setNotes(data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    // Create or edit note
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editNoteId) {
            // Edit note
            await fetch(`${process.env.REACT_APP_API_URL}/notes/${editNoteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description }),
            });
        } else {
            // Create note
            await fetch(`${process.env.REACT_APP_API_URL}/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description }),
            });
        }
        // Reset the form and fetch updated notes
        setTitle('');
        setDescription('');
        setEditNoteId(null);
        setShowModal(false); // Close modal
        fetchNotes();
    };

    // Set note to edit
    const handleEdit = (note) => {
        setTitle(note.title);
        setDescription(note.description);
        setEditNoteId(note._id);
        setShowModal(true); // Open modal
    };

    // Delete note
    const handleDelete = async (id) => {
        await fetch(`${process.env.REACT_APP_API_URL}/notes/${id}`, { method: 'DELETE' });
        fetchNotes();
    };

    // Open modal for adding a new note
    const handleAddNote = () => {
        setTitle('');
        setDescription('');
        setEditNoteId(null);
        setShowModal(true); // Open modal
    };

    // Close modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="container mt-5 w-100">
            <h2 className="text-center">Notes</h2>

            {/* Button to open modal for adding a new note */}
            <div className="d-flex justify-content-end mb-3 ">
            <Button
              variant="success"
              onClick={handleAddNote}
              className="rounded-circle"
              style={{
                position: 'fixed',
                bottom: '20px', // distance from the bottom
                right: '20px',  // distance from the right
                zIndex: 1000,
                height:  "60px", 
                width:  "60px",
                fontSize: '30px',
                fontWeight: 'bold'
                 // ensure it's above other elements
              }}
            >
              +
            </Button>
             </div>
            {/* Modal for add/edit note */}

            <Modal show={showModal} onHide={handleCloseModal} className="mt-5 pt-5">
                <Modal.Header closeButton>
                    <Modal.Title>{editNoteId ? 'Edit Note' : 'Add Note'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter note title"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter note description"
                                required
                            />
                        </Form.Group>

                        <Button type="submit" variant="primary">
                            {editNoteId ? 'Update Note' : 'Add Note'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Row>
                {notes.map((note) => (
                    <Col sm={12} md={6} lg={4} key={note._id} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{note.title}</Card.Title>
                                <Card.Text>
                                	<span dangerouslySetInnerHTML={{ __html: note.description }} />
                                </Card.Text>
                                <Button
                                    variant="warning"
                                    className="me-2"
                                    onClick={() => handleEdit(note)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(note._id)}
                                >
                                    Delete
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>


        </div>
    );
}
