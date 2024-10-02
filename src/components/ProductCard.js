import { Card, Button } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from "react-router-dom";

export default function ProductCard({ productProp }) {
    // Object Destructuring
    const { _id, category, name, description, price } = productProp;

    return (
        <div className="mb-3 col-6 col-md-3">
         <Card className=" h-100">
            <Card.Body>
                <Card.Title className="text-success">{name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Category: {category}</Card.Subtitle>
                <Card.Text>{description}</Card.Text>
                <Card.Subtitle className="mb-2">Price:</Card.Subtitle>
                <Card.Text>P {price}</Card.Text>
                {/*<Link className="btn btn-primary" to={`/products/${_id}`}>Details</Link>*/}
            </Card.Body>
        </Card>
        </div>
    )
}
