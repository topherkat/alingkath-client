import React, { useState, useContext } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { Notyf } from 'notyf';
import Swal from 'sweetalert2'
import UserContext from "../context/UserContext";


export default function ProductCard({ productProp }) {

    const notyf = new Notyf();
    // Object Destructuring
    const { _id, category, name, description, price, imageUrl } = productProp;

    // State to manage description visibility
    
    const {user, setUser } = useContext(UserContext);


    const [isUserInfoVisible, setUserInfo] = useState(false);
    
    // Toggle function to show/hide description
    const toggleUserInfo = () => {
        setUserInfo(!isUserInfoVisible);

        
    };

    


    function addToCart(productId, productName, quantity) {


        // Swal.fire({
        //   title: "Let's add this to cart?",
        //   text: name,
        //   icon: "warning",
        //   showCancelButton: true,
        //   confirmButtonColor: "#3085d6",
        //   cancelButtonColor: "#d33",
        //   confirmButtonText: "Add to Cart"
        // }).then((result) => {
        //   if (result.isConfirmed) {


            const token = localStorage.getItem('token'); // Assuming you're using JWT for authentication and storing the token in localStorage

            fetch(`${process.env.REACT_APP_API_URL}/cart`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`, // Ensure the user is authenticated
                },
                body: JSON.stringify({
                  productId: _id,
                  productName: name,
                  quantity: 1,
                }),
            })
            .then((response) => response.json())
            .then((data) => {
                
                if (data.message == 'Items added to cart successfully') {
                    // console.log('Items added to cart:', data.cart);
                    Swal.fire({
                      title: "Successfully Added to Cart",
                      text: name,
                      icon: "success"
                    });
                } 
            })
            .catch((error) => {
              console.error("Error adding to cart:", error.message);
              alert(`Failed to add to cart: ${error.message}`);
            });

        //   }
        // });   
    }



    return (
        <div className="mb-3 col-12 col-md-3">
            <Card className="h-100">
                {/* Display product image */}
                <Card.Img variant="top" src={imageUrl} alt={name} style={{ objectFit: "cover", height: "200px" }} className="mt-3 w-100" />

                <Card.Body className="d-flex flex-column justify-content-end">
                    <Card.Title className="text-success">{name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Category: {category}</Card.Subtitle>
                    

                    <div>

                    <button 
                        className="btn w-100  border mb-3" 
                        onClick={toggleUserInfo}
                    >
                        {isUserInfoVisible ? 'See Less' : 'Description ...'}
                    </button>


                    {/* Conditional rendering for description */}
                    {isUserInfoVisible ? (
                        <Card.Text className="mb-3">{description}</Card.Text>
                    ) : (
                        <Card.Text className=""></Card.Text>
                    )}
                    
                    {/* See More / See Less Button */}
                    
                    </div>

                    <Card.Subtitle className="mb-2">Price:</Card.Subtitle>
                    <Card.Text>P {price}</Card.Text>
                    {/* Link to the product details page */}
                    {
                        (user.id != null || user.id != undefined) ?
                        <Link className="btn btn-success w-100" onClick={addToCart}>Add to Cart</Link>
                        
                        :
                        <Link className="btn btn-danger w-100" to="/login">Login to Order</Link>
    
                    }
                    
                </Card.Body>
            </Card>
        </div>
    );
}
