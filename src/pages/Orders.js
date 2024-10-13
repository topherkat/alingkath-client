import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch orders from the server
    fetch(`${process.env.REACT_APP_API_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(data => {
      	console.log(data);
        if (data.message == "Orders retrieved successfully.") {
          setOrders(data.orders);
        } 
        setLoading(false);
      })
      .catch(err => {
        Swal.fire('Error', 'Failed to fetch orders', 'error');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading your orders...</div>;
  }

  return (
    <Container className="mt-5">
      <h2 className="ms-5 mb-4">Your Orders</h2>
      {orders.length > 0 ? (
        <>
          <Row>
            {orders.map((order) => (
              <Col md={12} className="mb-4" key={order._id}>
                <Card className="h-100">
                  <Card.Body>
                    <Row>
                      <Col md={12}>
                        <Card.Title>Order ID: {order._id}</Card.Title>
                        <Card.Text>
                          <strong>Date Ordered:</strong> {new Date(order.createdAt).toLocaleDateString()}
                        </Card.Text>
                        <Card.Text>
                          <strong>Total Price:</strong> P {order.totalPrice}
                        </Card.Text>
                        <Card.Text>
                          <strong>Order Type:</strong> {order.orderType}
                        </Card.Text>
                        <Card.Text>
                          <strong>Status:</strong> {order.status}
                        </Card.Text>

                        <Card.Text>
                          <strong>Products:</strong>
                          <ul>
                            {order.productsOrdered.map((product) => (
                              <li key={product.productId}>
                                {product.productName} - Quantity: {product.quantity} - Subtotal: P {product.subtotal}
                              </li>
                            ))}
                          </ul>
                        </Card.Text>
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
          <h4>You haven't placed any orders yet!</h4>
          <Link className="btn btn-primary" to="/products">
            Go Back to Products
          </Link>
        </div>
      )}
    </Container>
  );
}
