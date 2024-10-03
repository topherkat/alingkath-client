import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function ArchiveProduct({ product, isActive, fetchData }) {

    const notyf = new Notyf();

    // State for productId for the fetch URL
    const [productId, setProductId] = useState(product._id);

    // Function to toggle product archive status
    const archiveToggle = () => {
        fetch(`${process.env.REACT_APP_API_URL}/products/archive/${productId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                notyf.success("Product successfully archived");
                fetchData();  // Refresh product list
            } else {
                notyf.error("Something went wrong");
                fetchData();
            }
        });
    };

    const activateToggle = () => {
        fetch(`${process.env.REACT_APP_API_URL}/products/activate/${productId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                notyf.success("Product successfully activated");
                fetchData();  // Refresh product list
            } else {
                notyf.error("Something went wrong");
                fetchData();
            }
        });
    };


    return (
        <>
            {isActive ?
                <Button variant="success" size="sm" onClick={archiveToggle}>Available</Button>
                :
                <Button variant="danger" size="sm" onClick={activateToggle}>Unavailable</Button>
            }
        </>
    );
}
