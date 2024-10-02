import { Card, Button } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from "react-router-dom";

export default function ProductCard({ productProp }) {
    // Object Destructuring
    const { _id, category, name, description, price } = productProp;

    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Category: {category}</Card.Subtitle>
                <Card.Text>{description}</Card.Text>
                <Card.Subtitle className="mb-2">Price:</Card.Subtitle>
                <Card.Text>${price}</Card.Text>
                <Link className="btn btn-primary" to={`/products/${_id}`}>Details</Link>
            </Card.Body>
        </Card>
    )
}
