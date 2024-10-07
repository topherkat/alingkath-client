import React, { useEffect, useState, useContext } from 'react';
import UserContext from "../context/UserContext";

import { Container, Row, Col, Button, Card, Form } from 'react-bootstrap';
import {Navigate} from "react-router-dom";
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";

export default function Cart() {

  const {user, setUser } = useContext(UserContext); 

  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // To store selected items
  const [totalPrice, setTotalPrice] = useState(0); // To store the total price of selected items
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  	// "No matching document found for id "67000f1341aff0620da2e861" version 61 modifiedPaths "cartItems, totalPrice""
  	
  	console.log(cartItems)
    // Fetch cart items from the server
    const token = localStorage.getItem('token');

    fetch(`${process.env.REACT_APP_API_URL}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.message === "Cart retrieved successfully") {
          setCartItems(data.cart.cartItems);
        } else {
          alert('Error fetching cart items');
        }
        setLoading(false);
      })
      .catch(err => {
        alert('Failed to fetch cart data');
        setLoading(false);
      });
  }, []);

  useEffect(()=>{
  	console.log(selectedItems);
  },[selectedItems])

  // Function to handle checkbox selection
  const handleSelectItem = (item) => {
    const isSelected = selectedItems.some(selectedItem => selectedItem.productId === item.productId);

    let updatedSelectedItems;
    if (isSelected) {
      // Remove from selected items if already selected
      updatedSelectedItems = selectedItems.filter(selectedItem => selectedItem.productId !== item.productId);
    } else {
      // Add to selected items if not selected
      updatedSelectedItems = [...selectedItems, item];
    }
    setSelectedItems(updatedSelectedItems);

    // Calculate the total price based on selected items
    const newTotalPrice = updatedSelectedItems.reduce((acc, selectedItem) => acc + selectedItem.subtotal, 0);
    setTotalPrice(newTotalPrice);
  };

  // Function to remove an item from the cart
  const removeFromCart = (productId) => {
    Swal.fire({
      title: "Are you sure you want to remove this item from the cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!"
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        fetch(`${process.env.REACT_APP_API_URL}/cart/remove-from-cart/${productId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }

        })
          .then((res) => res.json())
          .then((data) => {
            if (data.message === "Item removed from cart successfully") {
              console.log(data);
              // Update cart items after item is removed
              setCartItems(data.cart.cartItems);
              // Remove item from selected items and recalculate total price
              const updatedSelectedItems = selectedItems.filter(selectedItem => selectedItem.productId !== productId);
              setSelectedItems(updatedSelectedItems);
              const newTotalPrice = updatedSelectedItems.reduce((acc, selectedItem) => acc + selectedItem.subtotal, 0);
              setTotalPrice(newTotalPrice);
            } else {
              alert('Failed to remove item from cart');
            }
          })
          .catch(() => {
            alert('An error occurred while removing the item');
          });
      }
    });
  };

  // Function to handle checkout for selected items
  const handleCheckoutSelected = () => { 
    if (selectedItems.length === 0) {
      alert("Please select items to checkout");
      return;
    }

    const token = localStorage.getItem('token');

    // Proceed to checkout with the selected items
    fetch(`${process.env.REACT_APP_API_URL}/orders/checkout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productsOrdered: selectedItems
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === "Checkout successful! Your order has been placed.") {
          Swal.fire("Success", "Your order has been placed!", "success");

          // After successful checkout, remove the selected items from the cart in the backend
          const removalRequests = selectedItems.map(item => 
            fetch(`${process.env.REACT_APP_API_URL}/cart/remove-from-cart/${item.productId}`, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              }
            })
          );

          // Wait for all removal requests to finish
          Promise.all(removalRequests)
            .then(() => {
              // Update the frontend to remove checked-out items from the cart
              const remainingCartItems = cartItems.filter(cartItem => 
                !selectedItems.some(selectedItem => selectedItem.productId === cartItem.productId)
              );
              setCartItems(remainingCartItems);
              setSelectedItems([]); // Clear the selected items
              setTotalPrice(remainingCartItems.reduce((acc, item) => acc + item.subtotal, 0)); // Recalculate total price for remaining items
            })
            .catch(() => {
              Swal.fire("Error", "An error occurred while removing items from the cart", "error");
            });

        } else {
          Swal.fire("Error", data.message, "error");
        }
      })
      .catch(() => {
        Swal.fire("Error", "An error occurred during checkout", "error");
      });
  };



  

  if (loading) {
    return <div>Loading cart items...</div>;
  }

  return (

  (user.id == undefined || user.id == null)? 
    <Navigate to="/login" />
  :
    <Container className="mt-5">
   
      {cartItems.length > 0 ? (
        <>
          <Row className="mb-3">
            <Col className="text-end me-3">
              <h4>Cart Selected Items Total: P {totalPrice}</h4>
              <Button variant="success" onClick={handleCheckoutSelected} className="">
                Checkout Selected
              </Button>
            </Col>

          </Row>

          <Row>
            {cartItems.map((item) => (
              <Col md={12} className="mb-4" key={item.productId}>
                <Card className="h-100">
                  <Card.Body>
                    <Row>
                      <Col className="col-8 col-md-10">
                        <Form.Check 
                          type="checkbox"
                          label="Select for checkout"
                          checked={selectedItems.some(selectedItem => selectedItem.productId === item.productId)}
                          onChange={() => handleSelectItem(item)}
                        />
                        <Card.Title>{item.productName}</Card.Title>
                        <Card.Text>Quantity: {item.quantity}</Card.Text>
                        <Card.Text>Price per item: P {item.subtotal / item.quantity}</Card.Text>
                        <Card.Text>Subtotal: P {item.subtotal}</Card.Text>
                      </Col>

                      <Col className="col-4 col-md-2 text-right d-flex flex-column gap-2 justify-content-end">
                        <Button variant="danger" onClick={() => removeFromCart(item.productId)}>
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <div className="text-center">
          <h4>Your cart is empty!</h4>
          <Link className="btn btn-primary" to="/products">
            Go Back to Products
          </Link>
        </div>
      )}
    </Container>
  );
}
